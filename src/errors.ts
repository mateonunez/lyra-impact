import {HTTP_STATUS} from "./http-status"

export const UNSUPPORTED_FETCHER = (fetcher: string) => `Unsupported fetcher: ${fetcher}`
export const UNSUPPORTED_CONTENT_TYPE = (contentType: string) => `Unsupported content type: ${contentType}`
export const FILE_NOT_FOUND = (filePath: string) => `File not found: ${filePath}`
export const MISSING_GRAPHQL_QUERY = () => "Missing graphql query"
export const RESPONSE_INVALID = (url: string, statusCode: number) => {
  const statusText = HTTP_STATUS[statusCode]
  return `Error fetching data from ${url}: ${statusCode} ${statusText}`
}
