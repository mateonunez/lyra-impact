/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Configuration as LyraConfiguration} from "@lyrasearch/lyra/dist/types"

export type ImpactOptions = {
  lyra?: Omit<LyraConfiguration<any>, "schema">
  fetch?: FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>
  property?: string
  strict?: boolean
}

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
