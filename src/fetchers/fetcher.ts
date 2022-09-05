import p from "phin"
import {parseData} from "../utils"

export type FetchOptions = RequestInit & {property?: string}

export default async function fetcher(url: string, options: FetchOptions): Promise<[]> {
  const {method = "GET", property} = options

  if (options.property) delete options.property

  const response = await p({
    url,
    method,
    ...options
  })

  const contentType = response?.headers?.["content-type"]?.split(";")[0] || "application/json"
  const extension = url?.split(".").pop() || "json"

  if (!response.statusCode || response.statusCode < 200 || response.statusCode > 299) {
    throw new Error("The request failed: " + response.statusCode)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = parseData(response.body, {
    contentType,
    extension,
    property
  })

  return data
}
