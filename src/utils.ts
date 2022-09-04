// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseData(data: Buffer, contentType: string, property?: string): any {
  let dataParsed

  if (contentType === "application/json") {
    dataParsed = parseJson(data, property)
  } else if (contentType === "text/csv") {
    dataParsed = parseCsv(data, property)
  } else if (contentType === "text/plain") {
    dataParsed = parseJson(data, property)
  } else {
    throw new Error(`Unsupported content type: ${contentType}`)
  }

  return dataParsed

  function parseJson(data: Buffer, property?: string): any {
    let dataParsed = JSON.parse(data.toString())

    if (property && dataParsed) {
      dataParsed = (dataParsed as any)[property]
    }


    return dataParsed
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function parseCsv(data: Buffer, property?: string): any {
    const dataParsed = data
      .toString()
      .split("\n")
      .map(line => line.split(",").map(sanitizeString))

    return dataParsed
  }
}

export function sanitizeString(str: string): string {
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "")
  return str.trim()
}
