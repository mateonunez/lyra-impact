import t from "tap"
import {getContentType} from "../../../runtimes/server/fetchers/filesystem"
import {getExtensionFromUrl} from "../../../utils"

t.test("server runtime", t => {
  t.plan(2)

  t.test("the content type should be computed correctly using the extension", t => {
    const json = getContentType("json")
    const csv = getContentType("csv")
    const txt = getContentType("txt")

    t.equal(json, "application/json")
    t.equal(csv, "text/csv")
    t.equal(txt, "text/plain")
    t.end()
  })

  t.test("the extension should be computed correctly using the url", t => {
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
