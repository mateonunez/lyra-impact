import graphqlFetcher from "../../fetchers/graphql"
import restFetcher from "../../fetchers/rest"
import filesystemFetcher from "../../fetchers/filesystem"
import {FetcherOptions, FilesystemOptions, GraphqlOptions, RestOptions} from "../../types"
import {UNSUPPORTED_FETCHER} from "../../errors"

export default async function fetcher(url: string, {fetcher, property, ...rest}: FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>): Promise<[]> {
  if (fetcher === "rest") {
    return restFetcher(url, {fetcher, property, ...rest} as FetcherOptions<RestOptions>)
  } else if (fetcher === "graphql") {
    return graphqlFetcher(url, {fetcher, property, ...rest} as FetcherOptions<GraphqlOptions>)
  } else if (fetcher === "filesystem") {
    // in this case, url is path
    return filesystemFetcher(url, {fetcher, property, ...rest} as FetcherOptions<FilesystemOptions>)
  } else {
    throw new Error(UNSUPPORTED_FETCHER(fetcher))
  }
}
