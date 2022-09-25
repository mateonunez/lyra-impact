import t from "tap"
import {search} from "@lyrasearch/lyra"
import {impact, collision} from "../runtimes/server"

const endpoint = "https://raw.githubusercontent.com/LyraSearch/lyra/main/examples/with-vue/public/pokedex.json"

t.test("should retrieve the data and create a Lyra instance", t => {
  t.plan(3)

  t.test("should retrieve the data and create a Lyra instance", async t => {
    t.plan(1)

    const lyra = await impact(endpoint, {
      property: "pokemon"
    })
    const result = search(lyra, {
      term: "pikachu",
      properties: ["name"]
    })

    t.equal(result.count, 1)
  })

  t.test("should results count match with hits length", async t => {
    t.plan(1)

    const lyra = await impact(endpoint, {
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

t.test("should collision search", async t => {
  t.plan(2)

  const {hits} = await collision(
    endpoint,
    {
      term: "pikachu",
      properties: ["name"]
    },
    {
      property: "pokemon"
    }
  )

  t.equal(hits.length, 1)
  t.equal(hits[0].name, "Pikachu")
})

t.test("should resolve the schema", t => {
  t.plan(1)

  t.test("should resolve with impact data", t => {
    t.plan(1)

    impact("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json").then(lyra => {
      const expectedSchema = {
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

t.test("should resolve the schema from a CSV file", t => {
  t.plan(2)

  t.test("should resolve with impact data", t => {
    t.plan(1)

    impact("https://cdn.wsform.com/wp-content/uploads/2018/09/country_full.csv").then(lyra => {
      const result = search(lyra, {
        term: "Colombia"
      })

      t.equal(result.count, 1)
    })
  })

  t.test("should have the headers as properties", t => {
    t.plan(1)

    impact("https://cdn.wsform.com/wp-content/uploads/2018/09/country_full.csv").then(lyra => {
      const result = search(lyra, {
        term: "Colombia"
      })

      t.ok(result.hits[0]["name"])
    })
  })
})

// t.test("should resolve the scema from a XML file", t => {
//   t.plan(1)

//   t.test("should resolve with impact data", t => {
//     t.plan(1)

//     impact("https://www.w3schools.com/xml/simple.xml", {
//       property: "breakfast_menu.food"
//     }).then(lyra => {
//       const result = search(lyra, {
//         term: "toast"
//       })

//       t.equal(result.count, 2)
//     })
//   })
// })

t.test("should resolve graphql data", t => {
  t.plan(1)

  t.test("should resolve with impact data", t => {
    t.plan(1)

    impact("https://rickandmortyapi.com/graphql", {
      fetch: {
        fetcher: "graphql",
        query: `{
          characters {
            results {
              type
              status
              species
              name
              id
              gender
            }
          }
        }`,
        property: "characters.results"
      }
    }).then(lyra => {
      const result = search(lyra, {
        term: "rick"
      })

      t.equal(result.count, 4)
    })
  })
})

t.test("should resolve filesystem data", t => {
  t.plan(1)

  t.test("should resolve with impact data", t => {
    t.plan(1)

    // the path shoul be relative to the project root
    impact("./package.json", {
      fetch: {
        fetcher: "filesystem"
      }
    }).then(lyra => {
      const result = search(lyra, {
        term: "mateonunez"
      })

      t.equal(result.count, 1)
    })
  })
})
