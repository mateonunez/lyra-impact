import p from "phin"
import {parseData} from "../utils"
import type {FetcherOptions, GraphqlOptions} from "."

export default async function graphqlFetcher(url: string, options: FetcherOptions<GraphqlOptions>): Promise<[]> {
  const {query, property} = options

  if (options.property) delete options.property

  if (!query) throw new Error("Missing query")

  const optionsGql = {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      query
    })
  }

  const response = await p(optionsGql)

  if (!response) throw new Error("No response")

  const contentType = response?.headers?.["content-type"]?.split(";")[0] || "application/json"

  if (!response.statusCode || response?.statusCode > 299 || response?.statusCode < 200) {
    throw new Error(`Error fetching data from ${url}: ${response.statusCode} ${response.statusMessage}`)
  }

  // data property is by default on GraphQL standard
  const {data: dataNotParsed} = JSON.parse(response.body.toString())
  const data = parseData(JSON.stringify(dataNotParsed), {
    contentType,
    property
  })

  return data
}
