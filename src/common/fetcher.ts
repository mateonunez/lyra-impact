export default async function fetcher (url: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    }
  })
  return await response.json();
}