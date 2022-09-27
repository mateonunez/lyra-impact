import {test} from "tap"
import {search} from "@lyrasearch/lyra"
import {collision, impact} from "../../../runtimes/server"
import {getContentType} from "../../../runtimes/server/fetchers/filesystem"
import {getExtensionFromUrl} from "../../../utils"

const pokedex = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
const countries = "https://cdn.wsform.com/wp-content/uploads/2018/09/country_full.csv"
const rickMorty = "https://rickandmortyapi.com/api/character"
const rickMortyGraphql = "https://rickandmortyapi.com/graphql"

test("server runtime", ({test, plan}) => {
  plan(4)

  test("impact", ({test, plan}) => {
    plan(3)

    test("rest fetcher", ({test, end}) => {
      test("should create a lyra instance", ({test, plan}) => {
        plan(3)

        test("without property", async ({same, end}) => {
          const lyra = await impact(pokedex)
          const result = search(lyra, {term: "pikachu"})

          same(result.count, 1)
          end()
        })

        test("with property", async ({same, end}) => {
          const lyra = await impact(rickMorty, {property: "results"})
          const result = search(lyra, {term: "rick", properties: ["name"]})

          same(result.count, 4)
          end()
        })

        test("from online csv", async ({same, end}) => {
          const lyra = await impact(countries)
          const result = search(lyra, {term: "Colombia"})

          same(result.count, 1)
          end()
        })
      })
      end()
    })

    test("graphql fetcher", async ({test, end}) => {
      test("should create a lyra instance", async ({test, plan}) => {
        plan(1)

        test("with property", async ({same, end}) => {
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

          same(result.count, 4)
          end()
        })
      })
      end()
    })

    test("filesystem fetcher", async ({test, end}) => {
      test("should create a lyra instance", async ({test, plan}) => {
        plan(1)

        test("json", async ({same, end}) => {
          const lyra = await impact("./package.json", {fetch: {fetcher: "filesystem"}})
          const result = search(lyra, {term: "mateonunez"})

          same(result.count, 1)
          end()
        })
      })
      end()
    })
  })

  test("collision", ({test, plan}) => {
    plan(3)

    test("rest fetcher", ({test, end}) => {
      test("should create a lyra instance", ({test, plan}) => {
        plan(3)

        test("without property", async ({same, end}) => {
          const {hits} = await collision(pokedex, {term: "pikachu"})

          same(hits.length, 1)
          end()
        })

        test("with property", async ({same, end}) => {
          const {hits} = await collision(rickMorty, {term: "rick", properties: ["name"]}, {property: "results"})

          same(hits.length, 4)
          end()
        })

        test("from online csv", async ({same, end}) => {
          const {hits} = await collision(countries, {term: "Colombia"})

          same(hits.length, 1)
          end()
        })
      })
      end()
    })

    test("graphql fetcher", ({test, end}) => {
      test("should create a lyra instance", ({test, plan}) => {
        plan(1)

        test("with property", async ({same, end}) => {
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

          same(hits.length, 4)
          end()
        })
      })
      end()
    })

    test("filesystem fetcher", ({test, end}) => {
      test("should create a lyra instance", ({test, plan}) => {
        plan(1)

        test("json", async ({same, end}) => {
          const {hits} = await collision("./package.json", {term: "mateonunez"}, {fetch: {fetcher: "filesystem"}})

          same(hits.length, 1)
          end()
        })
      })
      end()
    })
  })

  test("content-type", ({same, end}) => {
    const json = getContentType("json")
    const csv = getContentType("csv")
    const txt = getContentType("txt")

    same(json, "application/json")
    same(csv, "text/csv")
    same(txt, "text/txt")
    end()
  })

  test("extensions", ({same, end}) => {
    const json = getExtensionFromUrl("https://example.com/pokemon.json")
    const csv = getExtensionFromUrl("https://example.com/pokemon.csv")
    const txt = getExtensionFromUrl("https://example.com/pokemon.txt")
    const empty = getExtensionFromUrl("https://example.com/pokemon")

    same(json, "json")
    same(csv, "csv")
    same(txt, "txt")
    same(empty, "json")
    end()
  })
})
