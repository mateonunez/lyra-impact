import t from "tap"
import {parseData} from "../utils"

t.test("utils", t => {
  t.plan(1)

  t.test("should parse the json data correctly", t => {
    t.plan(4)

    t.test("should parse a simple json without property", t => {
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

      t.same(parsedData, expected)
      t.end()
    })

    t.test("should parse a simple json with property", t => {
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

      t.same(parsedData, expected)
      t.end()
    })

    t.test("should parse a simple json with a nested property", t => {
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

      t.same(parsedData, expected)
      t.end()
    })

    t.test("should compute the first useful property", t => {
      t.plan(1)

      const data = `{
        "data": [
          {
            "name": "John",
            "age": 30
          }
        ]
      }`

      const expected = [
        {
          name: "John",
          age: 30
        }
      ]

      const parsedData = parseData(data, {contentType: "application/json"})

      t.same(parsedData, expected)
      t.end()
    })
  })
})
