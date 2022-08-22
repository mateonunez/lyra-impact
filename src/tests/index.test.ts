import {search} from "@nearform/lyra"
import t from "tap"
import impact from ".."

t.test("should retrieve the data and create a Lyra instance", t => {
  t.plan(3)

  t.test("should retrieve the data and create a Lyra instance", async t => {
    t.plan(1)

    const lyra = await impact("https://raw.githubusercontent.com/nearform/lyra/main/packages/examples/with-react/public/pokedex.json", {
      property: "pokemon"
    })
    const result = search(lyra, {
      term: "pikachu"
    })

    t.equal(result.count, 1)
  })

  t.test("should results count match with hits length", async t => {
    t.plan(1)

    const lyra = await impact("https://raw.githubusercontent.com/nearform/lyra/main/packages/examples/with-react/public/pokedex.json", {
      property: "pokemon"
    })

    const results = search(lyra, {
      term: "pikachu",
      properties: ["name"]
    })

    t.equal(results.count, results.hits.length)
  })

  t.test("should retrieve the data using a custom property", t => {
    t.plan(1)
    // the data is in the "results" property {info: {...}, results: [{...}]}
    impact("https://rickandmortyapi.com/api/character/", {
      property: "results"
    }).then(lyra => {
      const result = search(lyra, {
        term: "rick"
      })

      t.equal(result.count, 4)
    })
  })
})

t.test("should resolve the schema", t => {
  t.plan(1)

  t.test("should resolve with impact data", t => {
    t.plan(1)

    impact("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json").then(lyra => {
      const expectedSchema = {
        id: "number",
        name: {
          english: "string",
          japanese: "string",
          chinese: "string",
          french: "string"
        },
        type: {
          "0": "string",
          "1": "string",
          "2": "string",
          "3": "string",
          "4": "string"
        },
        base: {
          HP: "number",
          Attack: "number",
          Defense: "number",
          "Sp. Attack": "number",
          "Sp. Defense": "number",
          Speed: "number"
        }
      }

      t.match(lyra.schema, expectedSchema)
    })
  })
})

t.test("errors", t => {
  t.plan(1)

  t.test("should throw an error when the data is not a valid JSON", t => {
    t.plan(1)

    impact("https://raw.githubusercontent.com/falsy/pokemon.json/falsy/pokedex.json").catch(err => {
      t.equal(err.message, "The request failed: 404")
    })
  })
})
