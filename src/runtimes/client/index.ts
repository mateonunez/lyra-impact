import {Lyra, PropertiesSchema, search, SearchParams, SearchResult} from "@lyrasearch/lyra"
import fetcher from "./fetchers"
import {getFetcherOptions} from "../common/fetchers"
import {createLyra, insertLyraData} from "../../utils"
import type {ImpactOptions} from "../../types"

export async function impact<T extends PropertiesSchema>(url: string, options?: ImpactOptions): Promise<Lyra<T>> {
  const fetcherOptions = getFetcherOptions("rest", options?.property, options?.fetch)

  const data = (await fetcher(url, {...fetcherOptions})) as unknown as T
  const lyra = createLyra(data, options?.lyra)

  insertLyraData(lyra, data)

  return lyra as unknown as Lyra<T>
}

export async function collision<T extends PropertiesSchema>(url: string, searchOptions: SearchParams<T>, impactOptions?: ImpactOptions): Promise<SearchResult<T>> {
  const lyra = (await impact(url, impactOptions)) as Lyra<T>

  const results = search(lyra, {
    ...searchOptions
  })

  return results as unknown as SearchResult<T>
}
