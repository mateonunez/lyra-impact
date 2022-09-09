import parseCsv from "./parsers/csv"
import parseJson from "./parsers/json"
import parseXml from "./parsers/xml"

export type ParseDataOptions = {
  contentType?: string
  extension?: string
  property?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseData(data: Buffer | string, options: ParseDataOptions): any {
  const {contentType = "*", extension, property} = options

  let dataParsed

  let content = data
  if (typeof content === "string") {
    content = Buffer.from(data)
  }
  content = content.toString()

  if (contentType === "application/json" || extension === "json") {
    dataParsed = parseJson(content, property)
  } else if (contentType === "text/csv" || extension === "csv") {
    dataParsed = parseCsv(content)
  } else if (contentType === "text/plain") {
    dataParsed = parseJson(content, property)
  } else if (contentType === "application/xml" || extension === "xml") {
    dataParsed = parseXml(content, property)
  } else {
    throw new Error(`Unsupported content type: ${contentType}`)
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
