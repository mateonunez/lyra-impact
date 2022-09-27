import {search} from "@lyrasearch/lyra"
import t from "tap"
import {collision, impact} from "../../../runtimes/server"
import {getContentType} from "../../../runtimes/server/fetchers/filesystem"
import {getExtensionFromUrl} from "../../../utils"

const pokedex = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
const countries = "https://cdn.wsform.com/wp-content/uploads/2018/09/country_full.csv"
const rickMorty = "https://rickandmortyapi.com/api/character"
const rickMortyGraphql = "https://rickandmortyapi.com/graphql"

t.test("server runtime", t => {
  t.plan(4)

  t.test("impact", async t => {
    t.plan(3)

    t.test("rest fetcher", async t => {
      t.test("should create a lyra instance", async t => {
        t.plan(3)

        t.test("without property", async t => {
          const lyra = await impact(pokedex)
          const result = search(lyra, {term: "pikachu"})

          t.equal(result.count, 1)
          t.end()
        })

        t.test("with property", async t => {
          const lyra = await impact(rickMorty, {property: "results"})
          const result = search(lyra, {term: "rick", properties: ["name"]})

          t.equal(result.count, 4)
          t.end()
        })

        t.test("from online csv", async t => {
          const lyra = await impact(countries)
          const result = search(lyra, {term: "Colombia"})

          t.equal(result.count, 1)
          t.end()
        })
      })
      t.end()
    })

    t.test("graphql fetcher", async t => {
      t.test("should create a lyra instance", async t => {
        t.plan(1)

        t.test("with property", async t => {
          const lyra = await impact(rickMortyGraphql, {
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
                  }
                }
              }`,
              property: "characters.results"
            }
          })
          const result = search(lyra, {term: "rick", properties: ["name"]})

          t.equal(result.count, 4)
          t.end()
        })
      })
      t.end()
    })

    t.test("filesystem fetcher", async t => {
      t.test("should create a lyra instance", async t => {
        t.plan(1)

        t.test("json", async t => {
          const lyra = await impact("./package.json", {fetch: {fetcher: "filesystem"}})
          const result = search(lyra, {term: "mateonunez"})

          t.equal(result.count, 1)
          t.end()
        })
      })
      t.end()
    })
  })

  t.test("collision", async t => {
    t.plan(3)

    t.test("rest fetcher", async t => {
      t.test("should create a lyra instance", async t => {
        t.plan(3)

        t.test("without property", async t => {
          const {hits} = await collision(pokedex, {term: "pikachu"})

          t.equal(hits.length, 1)
          t.end()
        })

        t.test("with property", async t => {
          const {hits} = await collision(rickMorty, {term: "rick", properties: ["name"]}, {property: "results"})

          t.equal(hits.length, 4)
          t.end()
        })

        t.test("from online csv", async t => {
          const {hits} = await collision(countries, {term: "Colombia"})

          t.equal(hits.length, 1)
          t.end()
        })
      })
      t.end()
    })

    t.test("graphql fetcher", async t => {
      t.test("should create a lyra instance", async t => {
        t.plan(1)

        t.test("with property", async t => {
          const {hits} = await collision(
            rickMortyGraphql,
            {term: "rick", properties: ["name"]},
            {
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
                  }
                }
              }`,
                property: "characters.results"
              }
            }
          )

          t.equal(hits.length, 4)
          t.end()
        })
      })
      t.end()
    })

    t.test("filesystem fetcher", async t => {
      t.test("should create a lyra instance", async t => {
        t.plan(1)

        t.test("json", async t => {
          const {hits} = await collision("./package.json", {term: "mateonunez"}, {fetch: {fetcher: "filesystem"}})

          t.equal(hits.length, 1)
          t.end()
        })
      })
      t.end()
    })
  })

  t.test("content-type", t => {
    const json = getContentType("json")
    const csv = getContentType("csv")
    const txt = getContentType("txt")

    t.equal(json, "application/json")
    t.equal(csv, "text/csv")
    t.equal(txt, "text/plain")
    t.end()
  })

  t.test("extensions", t => {
    const json = getExtensionFromUrl("https://example.com/pokemon.json")
    const csv = getExtensionFromUrl("https://example.com/pokemon.csv")
    const txt = getExtensionFromUrl("https://example.com/pokemon.txt")
    const empty = getExtensionFromUrl("https://example.com/pokemon")

    t.equal(json, "json")
    t.equal(csv, "csv")
    t.equal(txt, "txt")
    t.equal(empty, "json")
    t.end()
  })
})
