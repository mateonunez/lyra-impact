import p from "phin"
import {parseData} from "../utils"
import type {FetcherOptions, RestOptions} from "."

export default async function restFetcher(url: string, options: FetcherOptions<RestOptions>): Promise<[]> {
  const {method = "GET", property} = options

  if (options.property) delete options.property

  const response = await p({
    url,
    method,
    ...options
  })

  if (!response) throw new Error("No response")

  const contentType = response?.headers?.["content-type"]?.split(";")[0] || "application/json"
  const extension = url?.split(".").pop() || "json"

  if (!response.statusCode || response?.statusCode > 299 || response?.statusCode < 200) {
    throw new Error(`Error fetching data from ${url}: ${response.statusCode} ${response.statusMessage}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = parseData(response.body as Buffer, {
    contentType,
    extension,
    property
  })

  return data
}
