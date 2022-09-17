import {FetcherOptions, FilesystemOptions, GraphqlOptions, RestOptions} from "../../../types"

export function getFetcherOptions(
  fetcher: "rest" | "graphql" | "filesystem",
  property?: string,
  fetch?: RestOptions | GraphqlOptions | FilesystemOptions
): FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions> {
  return {
    fetcher,
    property,
    ...fetch
  }
}
