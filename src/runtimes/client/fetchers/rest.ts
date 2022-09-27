import {getExtensionFromUrl, parseData} from "../../../utils"
import type {FetcherOptions, RestOptions} from "../../../types"
import {RESPONSE_INVALID} from "../../../errors"

export default async function restFetcher(url: string, options: FetcherOptions<RestOptions>): Promise<[]> {
  const {method = "GET", property} = options

  if (options.property) delete options.property

  const response = await fetch(url, {
    method,
    ...(options as unknown as RequestInit)
  })

  if (!response.status || response?.status > 299 || response?.status < 200) {
    throw new Error(RESPONSE_INVALID(url, response.status))
  }

  const contentType = getContentType(response.headers)
  const extension = getExtensionFromUrl(url)
  const text = await response.text()
  const data = parseData(text, {
    contentType,
    extension,
    property
  })

  return data
}

export function getContentType(headers: Headers): string {
  return headers.get("content-type") || "application/json"
}
