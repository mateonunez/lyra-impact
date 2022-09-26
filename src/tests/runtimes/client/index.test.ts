import {search} from "@lyrasearch/lyra"
import t from "tap"
import {collision, impact} from "../../../runtimes/client"

const endpoint = "https://raw.githubusercontent.com/LyraSearch/lyra/main/examples/with-vue/public/pokedex.json"

t.test("client runtime", t => {
  t.plan(2)

  t.test("should retrieve the data and create a Lyra instance", async t => {
    const lyra = await impact(endpoint)
    const results = search(lyra, {term: "pikachu", properties: ["name"]})

    t.equal(results.count, 1)
  })

  t.test("should collision search", async t => {
    const {hits} = await collision(endpoint, {
      term: "pikachu",
      properties: ["name"]
    })

    t.equal(hits.length, 1)
  })
})
