/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Configuration as LyraConfiguration} from "@lyrasearch/lyra"
import {RequestOptions} from "undici/types/dispatcher"

export type ImpactOptions = {
  lyra?: LyraConfiguration<any>
  fetch?: FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>
  property?: string
}

export type RestOptions = RequestInit | RequestOptions

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
