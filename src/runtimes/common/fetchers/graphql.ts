import {parseData} from "../../../utils"
import type {FetcherOptions, GraphqlOptions} from "../../../types"
import {MISSING_GRAPHQL_QUERY, RESPONSE_INVALID} from "../../../errors"

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

  if (!response.status || response?.status > 299 || response?.status < 200) {
    throw new Error(RESPONSE_INVALID(url, response.status, response.statusText))
  }

  const contentType = response?.headers.get("content-type") || "application/json"
  // data property is by default on GraphQL standard
  const {data: dataNotParsed} = await response.json()
  const data = parseData(JSON.stringify(dataNotParsed), {
    contentType,
    property
  })

  return data
}
