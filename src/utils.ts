export type ParseDataOptions = {
  contentType?: string
  extension?: string
  property?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseData(data: Buffer | string, options: ParseDataOptions): any {
  const {contentType, extension, property} = options

  let dataParsed

  if (contentType === "application/json" || extension === "json") {
    dataParsed = parseJson(data, property)
  } else if (contentType === "text/csv" || extension === "csv") {
    dataParsed = parseCsv(data)
  } else if (contentType === "text/plain") {
    dataParsed = parseJson(data, property)
  } else {
    throw new Error(`Unsupported content type: ${contentType}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function parseJson(data: Buffer | string, property?: string): any {
    if (typeof data === "string") {
      data = Buffer.from(data)
    }

    let dataParsed = JSON.parse(data.toString())

    if (property && dataParsed) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataParsed = (dataParsed as any)[property]
    }

    return dataParsed
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  function parseCsv(data: Buffer | string): any {
    const dataParsed = data
      .toString()
      .split("\n")
      .map(line => line.split(",").map(sanitizeString))

    const headers = dataParsed.shift()

    // set the headers as key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataParsedWithHeaders = dataParsed.map((line: any) => {
      if (!headers) return line

      return line.reduce((acc: any, value: any, index: number) => {
        acc[headers[index]] = value
        return acc
      }, {})
    })

    return dataParsedWithHeaders
  }

  return dataParsed
}

export function sanitizeString(str: string): string {
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
  return str.trim()
}

export function getMaxOfArray(array: any[]): number {
  return array.reduce((max, v) => (max >= v ? max : v), -Infinity)
}
