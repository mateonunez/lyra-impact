// import p from "phin"
import {parseData} from "../utils"
import type {FetcherOptions, RestOptions} from "."

export default async function restFetcher(url: string, options: FetcherOptions<RestOptions>): Promise<[]> {
  const {method = "GET", property} = options

  if (options.property) delete options.property

  // const response = await p({
  //   url,
  //   method,
  //   ...options
  // })

  const response = await fetch(url, {
    method,
    ...options
  })

  if (!response) throw new Error("No response")

  const contentType = response.headers.get("content-type") || "application/json"
  const extension = url?.split(".").pop() || "json"

  if (!response.status || response?.status > 299 || response?.status < 200) {
    throw new Error(`Error fetching data from ${url}: ${response.status} ${response.statusText}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const text = await response.text()
  console.log({text})
  const data = parseData(text, {
    contentType,
    extension,
    property
  })

  return data
}
