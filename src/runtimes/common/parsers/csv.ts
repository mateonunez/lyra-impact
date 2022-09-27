import {sanitizeString} from "../../../utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function parseCsv(data: string): any {
  const dataParsed = data.split("\n").map(line => line.split(",").map(sanitizeString))

  const headers = dataParsed.shift() as string[]

  // set the headers as key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataParsedWithHeaders = dataParsed.map((line: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return line.reduce((acc: any, value: any, index: number) => {
      acc[headers[index]] = value
      return acc
    }, {})
  })

  return dataParsedWithHeaders
}
