// https://api.spacex.land/graphql/

import {FetchOptions, GraphqlOptions} from "."

export default async function graphqlFetcher(url: string, options: FetchOptions<GraphqlOptions>): Promise<[]> {
  const {query} = options
  console.log(query)
  return []
}
