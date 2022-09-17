export function UNSUPPORTED_FETCHER(fetcher: string): string {
  return `Unsupported fetcher: ${fetcher}`
}

export function UNSUPPORTED_CONTENT_TYPE(contentType: string): string {
  return `Unsupported content type: ${contentType}`
}

export function FILE_NOT_FOUND(filePath: string): string {
  return `File not found: ${filePath}`
}

export function FILESYSTEM_NOT_SUPPORTED(): string {
  return "Filesystem fetcher is not supported in browser"
}

export function MISSING_GRAPHQL_QUERY(): string {
  return "Missing graphql query"
}

export function NO_RESPONSE_FROM_SERVER(): string {
  return "No response from server"
}

export function RESPONSE_INVALID(url: string, status: number, statusText: string): string {
  return `Error fetching data from ${url}: ${status} ${statusText}`
}

export function UNSUPPORTED_TYPE_SCHEMA(type: string): string {
  return `Unsupported type schema: ${type}`
}
