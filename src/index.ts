import {create, insert} from "@nearform/lyra"
import fetcher from "./common/fetcher"
import {resolveSchema} from "./common/schema"
import type {Lyra, PropertiesSchema, Configuration as LyraConfiguration} from "@nearform/lyra"
import type {FetchOptions} from "./common/fetcher"

export type ImpactOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lyra?: LyraConfiguration<any>
  fetch?: FetchOptions
  property?: string
}

export async function impact<T extends PropertiesSchema>(url: string, options?: ImpactOptions): Promise<Lyra<T>> {
  const fetcherOptions = {
    method: "GET",
    property: options?.property,
    ...options?.fetch
  }
  const data = await fetcher(url, {...fetcherOptions})

  const schema = resolveSchema({}, data)
  const lyraOptions = {...options?.lyra}
  const lyra = create({schema, ...lyraOptions})

  for (const entry of data) {
    insert(lyra, entry)
  }

  return lyra as unknown as Lyra<T>
}
