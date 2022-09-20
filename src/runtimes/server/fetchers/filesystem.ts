import type {FetcherOptions, FilesystemOptions} from "../../../types"
import {isServer, parseData} from "../../../utils"
import fs from "fs"
import path, {join} from "path"
import {FILESYSTEM_NOT_SUPPORTED, FILE_NOT_FOUND} from "../../../errors"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function filesystemFetcher(url: string, options: FetcherOptions<FilesystemOptions>): Promise<[]> {
  if (!isServer) throw new Error(FILESYSTEM_NOT_SUPPORTED())

  const filePath = path.resolve(join(process.cwd(), url))

  if (!fs.existsSync(filePath)) throw new Error(FILE_NOT_FOUND(url))

  const extension = path.extname(filePath)
  const contentType = extension === "json" ? "application/json" : extension === ".csv" ? "text/csv" : "text/plain" // TODO: manage better content types
  const dataFile = fs.readFileSync(filePath, "utf8")

  const data = parseData(dataFile, {
    contentType,
    extension
  })

  return data
}
