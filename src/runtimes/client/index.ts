import {create, insert, Lyra, PropertiesSchema} from "@lyrasearch/lyra"
import {ImpactOptions} from "../.."
import {FetcherOptions, GraphqlOptions, RestOptions} from "../../fetchers"
import {resolveSchema} from "../../schema/resolver"
import fetcher from "./fetcher"

export async function impact<T extends PropertiesSchema>(url: string, options?: ImpactOptions): Promise<Lyra<T>> {
  const fetcherOptions = {
    fetcher: "rest",
    property: options?.property,
    ...options?.fetch
  } as FetcherOptions<RestOptions | GraphqlOptions>

  const data = (await fetcher(url, {...fetcherOptions})) as unknown as T

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
