import { Lyra, PropertiesSchema, insert } from "@nearform/lyra";

export function recursiveInsert<T extends PropertiesSchema>(lyra: Lyra<T>, value: any) {
  if (Array.isArray(value)) {
    recursiveInsert(lyra, value[0]);
  } else {
    insert(lyra, value);
  }
}