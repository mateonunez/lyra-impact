import {request} from "undici"
import {HttpMethod} from "undici/types/dispatcher"
import {RESPONSE_INVALID} from "../../../errors"
import {FetcherOptions, RestOptions} from "../../../types"
import {parseData} from "../../../utils"

export default async function restFetcher(url: string, options: FetcherOptions<RestOptions>): Promise<[]> {
  const method = options.method as HttpMethod | undefined
  const property = options.property

  if (options.property) delete options.property

  const response = await request(url as unknown as URL, {
    method
  })

  if (!response.statusCode || response.statusCode > 299 || response.statusCode < 200) {
    throw new Error(RESPONSE_INVALID(url, response.statusCode))
  }

  const contentType = response.headers["content-type"] || "application/json"
  const extension = url?.split(".").pop() || "json"

  const text = await response.body.text()

  const data = parseData(text, {
    contentType,
    extension,
    property
  })

  return data
}