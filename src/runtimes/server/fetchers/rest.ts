import {IncomingHttpHeaders} from "http"
import {request} from "undici"
import {RESPONSE_INVALID} from "../../../errors"
import {FetcherOptions, RestOptions} from "../../../types"
import {getExtensionFromUrl, parseData} from "../../../utils"

export default async function restFetcher(url: string, options: FetcherOptions<RestOptions>): Promise<[]> {
  const method = options.method as any
  const property = options.property

  if (options.property) delete options.property

  const response = await request(url as unknown as URL, {
    method
  })

  if (!response.statusCode || response.statusCode > 299 || response.statusCode < 200) {
    throw new Error(RESPONSE_INVALID(url, response.statusCode))
  }

  const contentType = getContentType(response.headers)
  const extension = getExtensionFromUrl(url)

  const text = await response.body.text()

  const data = parseData(text, {
    contentType,
    extension,
    property
  })

  return data
}

export function getContentType(headers: IncomingHttpHeaders): string {
  return headers["content-type"] as string
}
