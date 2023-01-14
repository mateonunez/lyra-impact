import {search} from "@lyrasearch/lyra"
import fetcher from "./fetchers"
import {getFetcherOptions} from "../common/fetchers"
import {createLyra, insertLyraData} from "../../utils"
import type {ImpactOptions} from "../../types"
import type {Lyra, PropertiesSchema} from "@lyrasearch/lyra/dist/types"
import type {SearchResult, SearchParams} from "@lyrasearch/lyra/dist/methods/search"

export async function impact<T extends PropertiesSchema>(url: string, options?: ImpactOptions): Promise<Lyra<T>> {
  const fetcherOptions = getFetcherOptions("rest", options?.property, options?.fetch)

  const data = (await fetcher(url, {...fetcherOptions})) as unknown as T
  const lyra = await createLyra(data, {...options?.lyra, strict: options?.strict || false})

  await insertLyraData(lyra, data, {strict: options?.strict || false})

  return lyra as unknown as Lyra<T>
}

export async function collision<T extends PropertiesSchema>(url: string, searchOptions: SearchParams<T>, impactOptions?: ImpactOptions): Promise<SearchResult<T>> {
  const lyra = (await impact(url, impactOptions)) as Lyra<T>

  const results = await search(lyra, {
    ...searchOptions
  })

  return results as unknown as SearchResult<T>
}
