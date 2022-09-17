import {UNSUPPORTED_CONTENT_TYPE} from "./errors"
import parseCsv from "./runtimes/common/parsers/csv"
import parseJson from "./runtimes/common/parsers/json"

export type ParseDataOptions = {
  contentType?: string
  extension?: string
  property?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseData(data: string, options: ParseDataOptions): any {
  const {contentType = "*", extension, property} = options

  let dataParsed
  if (contentType === "application/json" || extension === "json") {
    dataParsed = parseJson(data, property)
  } else if (contentType === "text/csv" || extension === "csv") {
    dataParsed = parseCsv(data)
  } else if (contentType === "text/xml" || extension === "xml") {
    throw new Error(UNSUPPORTED_CONTENT_TYPE(contentType))
  } else if (contentType === "text/plain") {
    dataParsed = parseJson(data, property)
  } else {
    throw new Error(UNSUPPORTED_CONTENT_TYPE(contentType))
  }

  return dataParsed
}

export function sanitizeString(str: string): string {
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
  return str.trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMaxOfArray(array: any[]): number {
  return array.reduce((max, v) => (max >= v ? max : v), -Infinity)
}

export const isServer = typeof window === "undefined"
