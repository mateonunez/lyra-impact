import p from 'phin'

export type FetchOptions = RequestInit & {property?: string}

export default async function fetcher(url: string, options: FetchOptions): Promise<[]> {
  const {method = "GET", property = null} = options

  if (options.property) delete options.property

  const response = await p({
    url,
    method,
    ...options
  })

  console.log(response.statusCode)

  if (!response.statusCode || response.statusCode < 200 || response.statusCode > 299) {
    throw new Error("The request failed: " + response.statusCode)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data = JSON.parse(response.body as any)

  if (property && data) {
    data = data[property]
  }

  return data
}
