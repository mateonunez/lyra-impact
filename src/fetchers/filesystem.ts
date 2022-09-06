import {FilesystemOptions} from "."
import {isServer} from "../utils"

export default async function filesystemFetcher(path: string, options: FilesystemOptions): Promise<[]> {
  if (!isServer) throw new Error("Filesystem fetcher is not supported in browser")

  return []
}
