import type {FetcherOptions, FilesystemOptions} from "../../../types"
import {parseData} from "../../../utils"
import fs from "fs"
import path, {join} from "path"
import {FILE_NOT_FOUND} from "../../../errors"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function filesystemFetcher(url: string, options: FetcherOptions<FilesystemOptions>): Promise<[]> {
  const filePath = path.resolve(join(process.cwd(), url))

  if (!fs.existsSync(filePath)) throw new Error(FILE_NOT_FOUND(url))

  const extension = path.extname(filePath)
  const contentType = getContentType(extension)
  const dataFile = fs.readFileSync(filePath, "utf8")

  const data = parseData(dataFile, {
    contentType,
    extension
  })

  return data
}

export function getContentType(extension: string) {
  return extension === "json" ? "application/json" : extension === "csv" ? "text/csv" : "text/plain"
}
