import {UNSUPPORTED_FETCHER} from "../../errors"
import graphqlFetcher from "../common/fetchers/graphql"
import restFetcher from "../common/fetchers/rest"

import type {FetcherOptions, GraphqlOptions, RestOptions} from "../../types"

export default async function fetcher(url: string, {fetcher, property, ...rest}: FetcherOptions<RestOptions | GraphqlOptions>): Promise<[]> {
  if (fetcher === "rest") {
    return restFetcher(url, {fetcher, property, ...rest} as FetcherOptions<RestOptions>)
  } else if (fetcher === "graphql") {
    return graphqlFetcher(url, {fetcher, property, ...rest} as FetcherOptions<GraphqlOptions>)
  } else {
    throw new Error(UNSUPPORTED_FETCHER(fetcher))
  }
}
