import { create, insert, search } from "@lyrasearch/lyra"
import {test} from "tap"
import {resolveSchema} from "../schema/resolver"
import {parseData} from "../utils"

test("utils - runtime server", ({test, plan}) => {
  plan(2)

  test("parsing data", ({test, plan}) => {
    plan(2)

    test("json", ({test, plan}) => {
      plan(4)

      test("without property", ({same, end}) => {
        const data = `{
          "name": "John",
          "age": 30,
          "cars": [
            { "name":"Ford", "models":[ "Fiesta", "Focus", "Mustang" ] },
            { "name":"BMW", "models":[ "320", "X3", "X5" ] },
            { "name":"Fiat", "models":[ "500", "Panda" ] }
          ]
        }`
        const expected = {
          name: "John",
          age: 30,
          cars: [
            {name: "Ford", models: ["Fiesta", "Focus", "Mustang"]},
            {name: "BMW", models: ["320", "X3", "X5"]},
            {name: "Fiat", models: ["500", "Panda"]}
          ]
        }
        const parsedData = parseData(data, {contentType: "application/json"})

        same(parsedData, expected)
        end()
      })

      test("with property", ({same, end}) => {
        const data = `{
          "name": "John",
          "age": 30,
          "cars": [
            { "name":"Ford", "models":[ "Fiesta", "Focus", "Mustang" ] },
            { "name":"BMW", "models":[ "320", "X3", "X5" ] },
            { "name":"Fiat", "models":[ "500", "Panda" ] }
          ]
        }`
        const expected = [
          {name: "Ford", models: ["Fiesta", "Focus", "Mustang"]},
          {name: "BMW", models: ["320", "X3", "X5"]},
          {name: "Fiat", models: ["500", "Panda"]}
        ]
        const parsedData = parseData(data, {contentType: "application/json", property: "cars"})

        same(parsedData, expected)
        end()
      })

      test("should parse a simple json with a nested property", ({same, end}) => {
        const data = `{
          "name": "John",
          "age": 30,
          "cars": {
            "name":"Ford",
            "models":[ "Fiesta", "Focus", "Mustang" ]
          }
        }`
        const expected = ["Fiesta", "Focus", "Mustang"]
        const parsedData = parseData(data, {contentType: "application/json", property: "cars.models"})

        same(parsedData, expected)
        end()
      })

      test("should compute the first useful property", ({same, end}) => {
        const data = `{
          "data": [
            {
              "name": "John",
              "age": 30,
              "has_car": true
            }
          ]
        }`
        const expected = [
          {
            name: "John",
            age: 30,
            has_car: true
          }
        ]

        const parsedData = parseData(data, {contentType: "application/json"})

        same(parsedData, expected)
        end()
      })
    })

    test("csv", ({test, plan}) => {
      plan(1)

      test("should parse a simple csv", ({same, end}) => {
        const data = `name,age
                      John,30
                      Sara,25`
        const expected = [
          {name: "John", age: "30"},
          {name: "Sara", age: "25"}
        ]
        const parsedData = parseData(data, {contentType: "text/csv"})

        same(parsedData, expected)
        end()
      })
    })
  })

  test("schema", ({test, plan}) => {
    plan(2)

    test("the schema should be resolved", ({same, end}) => {
      const data = {name: "mateonunez", age: 27, is_admin: false}
      const expected = {name: "string", age: "number", is_admin: "boolean"}
      const schema = resolveSchema({}, data)

      same(schema, expected)
      end()
    })

    test("the schema with nested object should be resolved and searchable", ({same, end}) => {
      const data = {name: "mateonunez", age: 27, is_admin: false, address: {street: "street", number: 123}}
      const expected = {name: "string", age: "number", is_admin: "boolean", address: {street: "string", number: "number"}}
      const schema = resolveSchema({}, data)

      const lyra = create({schema})
      insert(lyra, data)
      const {hits} = search(lyra, {
        term: "street"
      })

      same(schema, expected)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      same(hits.map(({id, ...rest}) => ({...rest})), [data])
      end()
    })
  })
})
