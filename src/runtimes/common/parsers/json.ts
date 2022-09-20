// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function parseJson(data: string, property?: string): any {
  let dataParsed = JSON.parse(data)

  if (property && dataParsed) {
    const isNestedProperty = property.includes(".")
    const propertyArray = property.split(".")

    if (isNestedProperty) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataParsedNested: any = dataParsed

      for (let i = 0; i < propertyArray.length; i++) {
        const property = propertyArray[i]
        dataParsedNested = dataParsedNested[property]
      }

      dataParsed = dataParsedNested
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataParsed = (dataParsed as any)[property]
    }
  }

  return dataParsed
}
