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

  const computeProperty = (property?: string) => {
    if (property) return property

    const dataParsed = JSON.parse(data)
    const keys = Object.keys(dataParsed)
    const mainProperty = keys.every(key => Number.isInteger(Number(key))) ? "" : keys[0]

    // computing nested properties are not supported yet
    const computedProperty = Array.isArray(dataParsed[mainProperty]) ? mainProperty : ""
    return computedProperty
  }

  let dataParsed
  if (contentType.includes("application/json") || extension?.includes("json") || contentType.includes("text/plain")) {
    dataParsed = parseJson(data, computeProperty(property))
  } else if (contentType.includes("text/csv") || extension?.includes("csv")) {
    dataParsed = parseCsv(data)
  } else if (contentType.includes("text/xml") || extension?.includes("xml")) {
    throw new Error(UNSUPPORTED_CONTENT_TYPE(contentType))
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
  let dataToInsert = data

  if (Array.isArray(dataToInsert)) {
    for (let entry of dataToInsert) {
      entry = removeId(entry)
      entry = removeNulls(entry)

      insertLyraData(lyra, entry)
    }
  } else {
    dataToInsert = removeId(dataToInsert)
    dataToInsert = removeNulls(dataToInsert)

    for (const key in dataToInsert) {
      // Array of objects are not supported yet
      if (Array.isArray(dataToInsert[key])) delete dataToInsert[key]
    }

    insert(lyra, dataToInsert)
  }
}

function removeId(entry: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...rest} = entry
  return rest
}

function removeNulls(entry: any) {
  const rest: any = {}
  for (const key in entry) {
    if (entry[key] !== null) rest[key] = entry[key]
  }
  return rest
}
