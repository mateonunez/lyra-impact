import {create, insert, search, SearchResult} from "@nearform/lyra"
import fetcher from "./common/fetcher"
import {resolveSchema} from "./common/schema"
import type {Lyra, PropertiesSchema, Configuration as LyraConfiguration, SearchParams} from "@nearform/lyra"
import type {FetchOptions} from "./common/fetcher"

export type ImpactOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lyra?: LyraConfiguration<any>
  fetch?: FetchOptions
  property?: string
}

export default async function impact<T extends PropertiesSchema>(url: string, options?: ImpactOptions): Promise<Lyra<T>> {
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

export async function collision<T extends PropertiesSchema>(url: string, searchOptions: SearchParams<T>, options?: ImpactOptions
): Promise<SearchResult<T>> {
  const lyra = (await impact(url, options)) as Lyra<T>

  const results = search(lyra, {
    ...searchOptions
  })

  return results as unknown as SearchResult<T>
}
