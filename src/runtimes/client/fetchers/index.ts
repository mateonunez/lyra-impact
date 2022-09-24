import {FILESYSTEM_NOT_SUPPORTED, UNSUPPORTED_FETCHER} from "../../../errors"
import graphqlFetcher from "./graphql"
import restFetcher from "./rest"

import type {FetcherOptions, GraphqlOptions, RestOptions} from "../../../types"

export default async function fetcher(url: string, {fetcher, property, ...rest}: FetcherOptions<RestOptions | GraphqlOptions>): Promise<[]> {
  if (fetcher === "rest") {
    return restFetcher(url, {fetcher, property, ...rest} as FetcherOptions<RestOptions>)
  } else if (fetcher === "graphql") {
    return graphqlFetcher(url, {fetcher, property, ...rest} as FetcherOptions<GraphqlOptions>)
  } else if (fetcher === "filesystem") {
    throw new Error(FILESYSTEM_NOT_SUPPORTED())
  } else {
    throw new Error(UNSUPPORTED_FETCHER(fetcher))
  }
}
