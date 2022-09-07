import {FetcherOptions, FilesystemOptions} from "."
import {isServer, parseData} from "../utils"
import fs from "fs"
import path from "path"

export default async function filesystemFetcher(url: string, options: FetcherOptions<FilesystemOptions>): Promise<[]> {
  if (!isServer) throw new Error("Filesystem fetcher is not supported in browser")

  // const {property} = options

  // check if file exists
  if (!fs.existsSync(url)) throw new Error(`File not found: ${path}`)

  const extension = path.extname(url)
  const dataFile = fs.readFileSync(url, "utf8")

  const data = parseData(dataFile, {
    extension
  })

  return data
}
