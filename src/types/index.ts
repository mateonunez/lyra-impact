import type {Configuration as LyraConfiguration} from "@lyrasearch/lyra"
import type {FetcherOptions, FilesystemOptions, GraphqlOptions, RestOptions} from "../fetchers"

export type ImpactOptions = {
  lyra?: LyraConfiguration<any>
  fetch?: FetcherOptions<RestOptions | GraphqlOptions | FilesystemOptions>
  property?: string
}
