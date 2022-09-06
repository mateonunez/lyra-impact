import graphqlFetcher from "./graphql"
import restFetcher from "./rest"

export type GraphqlOptions = {
  query?: string
  isGraphql?: boolean
}

export type FetchOptions<T> = T extends {isGraphql: true} ? T & GraphqlOptions : T & RequestInit

export default async function fetcher(url: string, options: FetchOptions<RequestInit & GraphqlOptions & {property?: string}>): Promise<[]> {
  const {isGraphql = false} = options

  if (isGraphql) {
    return graphqlFetcher(url, options)
  }

  return restFetcher(url, options)
}
