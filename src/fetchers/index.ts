import graphqlFetcher from "./graphql"
import restFetcher from "./rest"
import filesystemFetcher from "./filesystem"

export type RestOptions = RequestInit

export type GraphqlOptions = {
  query?: string
}

export type FilesystemOptions = {
  path?: string
}

export type FetcherOptions<T> = {
  fetcher: "rest" | "graphql" | "filesystem"
  property?: string
} & T

export default async function fetcher(url: string, {fetcher, property, ...rest}: FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>): Promise<[]> {
  if (fetcher === "rest") {
    return restFetcher(url, {fetcher, property, ...rest} as FetcherOptions<RestOptions>)
  } else if (fetcher === "graphql") {
    return graphqlFetcher(url, {fetcher, property, ...rest} as FetcherOptions<GraphqlOptions>)
  } else if (fetcher === "filesystem") {
    // in this case, url is path
    return filesystemFetcher(url, {fetcher, property, ...rest} as FetcherOptions<FilesystemOptions>)
  } else {
    throw new Error(`Unsupported fetcher: ${fetcher}`)
  }
}
