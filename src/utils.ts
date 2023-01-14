/* eslint-disable @typescript-eslint/no-explicit-any */
import {create, insert} from "@lyrasearch/lyra"
import {UNSUPPORTED_CONTENT_TYPE} from "./errors"
import parseCsv from "./runtimes/common/parsers/csv"
import parseJson from "./runtimes/common/parsers/json"
import resolveSchema from "@mateonunez/lyra-schema-resolver"
import {Lyra, Configuration as LyraConfiguration, PropertiesSchema} from "@lyrasearch/lyra/dist/types"
export type ParseDataOptions = {
  contentType?: string
  extension?: string
  property?: string
}

export function computeProperty(data: string, property?: string): string {
  if (property) return property
  const dataParsed = JSON.parse(data)
  const keys = Object.keys(dataParsed)
  const mainProperty = keys.every(key => Number.isInteger(Number(key))) ? "" : Object.hasOwn(dataParsed, "data") ? "data" : keys[0]
  // computing nested properties are not supported yet
  const computedProperty = Array.isArray(dataParsed[mainProperty]) ? mainProperty : ""
  return computedProperty
}

export function parseData(data: string, options: ParseDataOptions): any {
  const {contentType = "*", extension, property} = options

  if (contentType.includes("application/json") || extension?.includes("json") || contentType.includes("text/plain")) {
    return parseJson(data, computeProperty(data, property))
  } else if (contentType.includes("text/csv") || extension?.includes("csv")) {
    return parseCsv(data)
  }

  throw new Error(UNSUPPORTED_CONTENT_TYPE(contentType))
}

export function sanitizeString(str: string): string {
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
  return str.trim()
}

export async function createLyra<T extends PropertiesSchema>(data: any, options?: Omit<LyraConfiguration<any>, "schema"> & {strict?: boolean}): Promise<Lyra<T>> {
  const schema = resolveSchema(data, {strict: options?.strict})
  const lyra = await create({
    schema,
    ...options
  })
  return lyra as unknown as Promise<Lyra<T>>
}

export async function insertLyraData<T extends PropertiesSchema>(lyra: Lyra<T>, data: any, options: {strict?: boolean}): Promise<void> {
  if (Array.isArray(data)) {
    for (let entry of data) {
      entry = removeId(entry)
      entry = removeNulls(entry)

      await insertLyraData(lyra, entry, {strict: options.strict})
    }
  } else {
    if (!options.strict) {
      for (const field of Object.keys(data)) {
        if (typeof data[field] === "object") {
          data[field] = JSON.stringify(data[field])
        } else {
          data[field] = String(data[field])
        }
      }

      await insert(lyra, data)
    }
  }
}

export function getExtensionFromUrl(url: string): string {
  const extension = url?.split(".").pop()
  if (extension?.includes("/") || !extension) return "json"

  return extension
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
