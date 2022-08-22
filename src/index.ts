import {Lyra, PropertiesSchema, create, insert} from "@nearform/lyra"
import fetcher, {FetchOptions} from "./common/fetcher"
import {resolveSchema} from "./common/schema"

export async function impact<T extends PropertiesSchema>(url: string, options?: FetchOptions): Promise<Lyra<T>> {
  const data = await fetcher(url, {
    method: "GET",
    ...options
  })

  const schema = resolveSchema({}, data)

  const lyra = create({
    schema,
    defaultLanguage: "english"
  })

  for (const entry of data) {
    insert(lyra, entry)
  }

  return lyra as unknown as Lyra<T>
}
