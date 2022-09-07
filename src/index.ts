import {create, insert, search, SearchResult} from "@lyrasearch/lyra"
import fetcher, {FetcherOptions, FilesystemOptions, GraphqlOptions, RestOptions} from "./fetchers"
import {resolveSchema} from "./schema/resolver"
import type {Lyra, PropertiesSchema, Configuration as LyraConfiguration, SearchParams} from "@lyrasearch/lyra"

export type ImpactOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lyra?: LyraConfiguration<any>
  fetch?: FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>
  property?: string
}

export async function impact<T extends PropertiesSchema>(url: string, options?: ImpactOptions): Promise<Lyra<T>> {
  const fetcherOptions = {
    fetcher: "rest",
    property: options?.property,
    ...options?.fetch
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await fetcher(url, {...fetcherOptions} as FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>)) as any

  const schema = resolveSchema({}, data)
  const lyraOptions = {...options?.lyra}
  const lyra = create({schema, ...lyraOptions})

  if (Array.isArray(data)) {
    for (const entry of data) {
      if (entry?.id) delete entry.id

      insert(lyra, entry)
    }
  } else {
    if (data?.id) delete data.id

    insert(lyra, data)
  }

  return lyra as unknown as Lyra<T>
}

export async function collision<T extends PropertiesSchema>(url: string, searchOptions: SearchParams<T>, impactOptions?: ImpactOptions): Promise<SearchResult<T>> {
  const lyra = (await impact(url, impactOptions)) as Lyra<T>

  const results = search(lyra, {
    ...searchOptions
  })

  return results as unknown as SearchResult<T>
}
