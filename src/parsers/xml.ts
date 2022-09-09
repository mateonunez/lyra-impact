import {parseString} from "xml2js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function parseXml(data: string, property?: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dataParsed: any = {}

  parseString(
    data,
    {
      trim: true,
      emptyTag: "",
      explicitArray: false,
      ignoreAttrs: true
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err: any, result) => {
      if (err) {
        throw new Error(err)
      }

      dataParsed = result
    }
  )

  if (property && dataParsed) {
    const isNestedProperty = property.includes(".")
    const propertyArray = property.split(".")

    if (isNestedProperty) {
      let i = 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataParsedNested: any = dataParsed

      while (i < propertyArray.length) {
        if (dataParsedNested[propertyArray[i]]) {
          dataParsedNested = dataParsedNested[propertyArray[i]]
          i++
        }
      }

      dataParsed = dataParsedNested
    } else {
      if (dataParsed[property]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataParsed = (dataParsed as any)[property]
      }
    }
  }

  return dataParsed
}
