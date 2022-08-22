export type FetchOptions = RequestInit & {property?: string}

export default async function fetcher(url: string, options: FetchOptions): Promise<[]> {
  const {method = "GET", property = null} = options
  delete options.property

  const response = await fetch(url, {
    method,
    ...options
  })

  if (!response.ok) {
    throw new Error("The request failed: " + response.status)
  }

  let data = await response.json()

  if (property) {
    data = data[property]
  }

  return data
}
