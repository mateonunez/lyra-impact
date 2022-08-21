export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: {[key: string]: string};
  selector?: (...args: any[]) => any;
  property?: string;
}

export default async function fetcher (url: string, options: FetchOptions): Promise<[]> {
  const { method = "GET", headers = {}, selector, property = null } = options;

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    }
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  let data = await response.json()

  if (property) {
    data = data[property]
  }

  return data;
}