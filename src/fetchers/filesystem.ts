import {FetcherOptions, FilesystemOptions} from "."
import {isServer, parseData} from "../utils"
import fs from "fs"
import path from "path"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function filesystemFetcher(url: string, options: FetcherOptions<FilesystemOptions>): Promise<[]> {
  if (!isServer) throw new Error("Filesystem fetcher is not supported in browser")

  if (!fs.existsSync(url)) throw new Error(`File not found: ${path}`)

  const extension = path.extname(url)
  const contentType = extension === "json" ? "application/json" : extension === ".csv" ? "text/csv" : "text/plain" // TODO: manage better content types
  const dataFile = fs.readFileSync(url, "utf8")

  const data = parseData(dataFile, {
    contentType,
    extension
  })

  return data
}
