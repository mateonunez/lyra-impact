import {FetcherOptions, GraphqlOptions, RestOptions} from "../../fetchers"
import graphqlFetcher from "../../fetchers/graphql"
import restFetcher from "../../fetchers/rest"

export default async function fetcher(url: string, {fetcher, property, ...rest}: FetcherOptions<RestOptions | GraphqlOptions>): Promise<[]> {
  if (fetcher === "rest") {
    return restFetcher(url, {fetcher, property, ...rest} as FetcherOptions<RestOptions>)
  } else if (fetcher === "graphql") {
    return graphqlFetcher(url, {fetcher, property, ...rest} as FetcherOptions<GraphqlOptions>)
  } else {
    throw new Error(`Unsupported fetcher: ${fetcher}`)
  }
}
