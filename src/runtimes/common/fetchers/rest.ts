import {parseData} from "../../../utils"
import type {FetcherOptions, RestOptions} from "../../../types"
import {NO_RESPONSE_FROM_SERVER, RESPONSE_INVALID} from "../../../errors"

export default async function restFetcher(url: string, options: FetcherOptions<RestOptions>): Promise<[]> {
  const {method = "GET", property} = options

  if (options.property) delete options.property

  const response = await fetch(url, {
    method,
    ...options
  })

  if (!response) throw new Error(NO_RESPONSE_FROM_SERVER())

  const contentType = response?.headers.get("content-type")?.split(";")[0] || "application/json"
  const extension = url?.split(".").pop() || "json"

  if (!response.status || response?.status > 299 || response?.status < 200) {
    throw new Error(RESPONSE_INVALID(url, response.status, response.statusText))
  }

  const text = await response.text()
  const data = parseData(text, {
    contentType,
    extension,
    property
  })

  return data
}
