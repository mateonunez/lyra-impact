// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function parseXml(data: string, property?: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataParsed: any = {}

  const xmlParsed = data.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)

  for (const match of xmlParsed) {
    console.log({match})
    const key = match[1] || match[3]
    const value = match[2] && parseXml(match[2], property)
    dataParsed[key] = (value && Object.keys(value).length ? value : match[2]) || null
  }

  return dataParsed
}
