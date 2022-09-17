/* eslint-disable @typescript-eslint/no-explicit-any */
import {Configuration as LyraConfiguration, create, insert, Lyra, PropertiesSchema} from "@lyrasearch/lyra"
import {UNSUPPORTED_CONTENT_TYPE} from "./errors"
import parseCsv from "./runtimes/common/parsers/csv"
import parseJson from "./runtimes/common/parsers/json"
import {resolveSchema} from "./schema/resolver"

export type ParseDataOptions = {
  contentType?: string
  extension?: string
  property?: string
}

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

export function getMaxOfArray(array: any[]): number {
  return array.reduce((max, v) => (max >= v ? max : v), -Infinity)
}

export const isServer = typeof window === "undefined"

export function createLyra<T extends PropertiesSchema>(data: any, options?: LyraConfiguration<any>): Lyra<T> {
  const schema = resolveSchema({}, data)
  const lyra = create({
    schema,
    ...options
  })
  return lyra as unknown as Lyra<T>
}

export function insertLyraData<T extends PropertiesSchema>(lyra: Lyra<T>, data: any): void {
  if (Array.isArray(data)) {
    for (const entry of data) {
      if (entry?.id) delete entry.id

      insert(lyra, entry)
    }
  } else {
    if (data?.id) delete data.id

    insert(lyra, data)
  }
}
