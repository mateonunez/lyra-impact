//
import p from "phin"

import {FetchOptions, GraphqlOptions} from "."
import {parseData} from "../utils"

export default async function graphqlFetcher(url: string, options: FetchOptions<GraphqlOptions & {property?: string}>): Promise<[]> {
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
  const contentType = response?.headers?.["content-type"]?.split(";")[0] || "application/json"

  const {data: dataNotParsed} = JSON.parse(response.body.toString())
  const data = parseData(JSON.stringify(dataNotParsed), {
    contentType,
    property
  })

  return data
}
