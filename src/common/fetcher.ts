export type FetchOptions = RequestInit & { property?: string }

export default async function fetcher(url: string, options: FetchOptions): Promise<[]> {
  const { method = "GET", headers = {}, property = null } = options

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
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
