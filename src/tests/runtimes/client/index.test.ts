import t from "tap"
import {search} from "@lyrasearch/lyra"
import {collision, impact} from "../../../runtimes/client"
import {getContentType} from "../../../runtimes/client/fetchers/rest"
import { getExtensionFromUrl } from "../../../utils"

const endpoint = "https://raw.githubusercontent.com/LyraSearch/lyra/main/examples/with-vue/public/pokedex.json"

t.test("client runtime", t => {
  t.plan(5)

  t.test("should retrieve the data and create a Lyra instance", async t => {
    const lyra = await impact(endpoint, {
      property: "pokemon"
    })
    const results = search(lyra, {term: "pikachu", properties: ["name"]})

    t.equal(results.count, 1)
    t.end()
  })

  t.test("should collision search", async t => {
    const {hits} = await collision(endpoint, {
      term: "pikachu",
      properties: ["name"]
    })

    t.equal(hits.length, 1)
    t.end()
  })

  t.test("the content type should be text/plain; charset=utf-8", async t => {
    const response = await fetch(endpoint)
    const contentType = getContentType(response.headers)

    t.equal(contentType, "text/plain; charset=utf-8")
    t.end()
  })

  t.test("should retrieve the data and create a Lyra instance using graphql", async t => {
    const lyra = await impact("https://rickandmortyapi.com/graphql", {
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
    })

    const results = search(lyra, {term: "rick"})

    t.equal(results.count, 4)
  })

  t.test("when the url is not valid the extension should be a json", t => {
    const extension = getExtensionFromUrl("")

    t.equal(extension, "json")
    t.end()
  })
})
