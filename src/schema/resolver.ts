import {UNSUPPORTED_TYPE_SCHEMA} from "../errors"
import {getMaxOfArray} from "../utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveSchema(schema: any, data: any): any {
  if (Array.isArray(data)) {
    // finds the biggest element in the data so we can build our schema from that
    const sizes = data.map(entry => Object.values(entry).length)
    const max = getMaxOfArray(sizes)
    const idx = sizes.indexOf(max)

    return resolveSchema(schema, {...data[idx]})
  } else {
    for (const key in data) {
      const type = typeof data[key]

      if (Array.isArray(data[key])) {
        if (!schema[key]) {
          schema[key] = resolveSchema([], data[key])
        }
      } else if (type === "object") {
        if (!schema[key]) {
          schema[key] = resolveSchema({}, data[key])
        }
      } else if (type === "string") {
        schema[key] = "string"
      } else if (type === "number") {
        schema[key] = "number"
      } else if (type === "boolean") {
        schema[key] = "boolean"
      } else {
        throw new Error(UNSUPPORTED_TYPE_SCHEMA(type))
      }
    }
  }

  if (schema.id) {
    delete schema.id
  }

  return schema
}
