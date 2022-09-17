import {parseData} from "../../../utils"
import type {FetcherOptions, GraphqlOptions} from "../../../types"
import {MISSING_GRAPHQL_QUERY, NO_RESPONSE_FROM_SERVER, RESPONSE_INVALID} from "../../../errors"

export default async function graphqlFetcher(url: string, options: FetcherOptions<GraphqlOptions>): Promise<[]> {
  const {query, property} = options

  if (options.property) delete options.property

  if (!query) throw new Error(MISSING_GRAPHQL_QUERY())

  const optionsGql = {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query
    })
  } as RequestInit

  const response = await fetch(url, {
    method: "POST",
    ...optionsGql
  })

  if (!response) throw new Error(NO_RESPONSE_FROM_SERVER())

  const contentType = response?.headers.get("content-type")?.split(";")[0] || "application/json"

  if (!response.status || response?.status > 299 || response?.status < 200) {
    throw new Error(RESPONSE_INVALID(url, response.status, response.statusText))
  }

  // data property is by default on GraphQL standard
  const {data: dataNotParsed} = await response.json()
  const data = parseData(JSON.stringify(dataNotParsed), {
    contentType,
    property
  })

  return data
}
