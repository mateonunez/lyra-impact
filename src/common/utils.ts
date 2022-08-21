import { Lyra, PropertiesSchema, insert } from "@nearform/lyra"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recursiveInsert<T extends PropertiesSchema>(lyra: Lyra<T>, value: any) {
  if (Array.isArray(value)) {
    recursiveInsert(lyra, value[0])
  } else {
    insert(lyra, value)
  }
}
