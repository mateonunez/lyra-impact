import {request} from "undici"
import {parseData} from "../../../utils"
import {MISSING_GRAPHQL_QUERY, RESPONSE_INVALID} from "../../../errors"
import type {FetcherOptions, GraphqlOptions} from "../../../types"

export default async function graphqlFetcher(url: string, options: FetcherOptions<GraphqlOptions>): Promise<[]> {
  const {query, property} = options
  const method = "POST"

  if (options.property) delete options.property

  if (!query) throw new Error(MISSING_GRAPHQL_QUERY())

  const optionsGql = {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query
    })
  }

  const response = await request(url, {
    method,
    ...optionsGql
  })

  if (!response.statusCode || response?.statusCode > 299 || response?.statusCode < 200) {
    throw new Error(RESPONSE_INVALID(url, response.statusCode))
  }

  const contentType = response.headers["content-type"] as string
  // data property is by default on GraphQL standard
  const {data: dataNotParsed} = await response.body.json()

  const data = parseData(JSON.stringify(dataNotParsed), {
    contentType,
    property
  })

  return data
}
