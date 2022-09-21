import t from "tap"
import {FILESYSTEM_NOT_SUPPORTED, FILE_NOT_FOUND, MISSING_GRAPHQL_QUERY, RESPONSE_INVALID, UNSUPPORTED_CONTENT_TYPE, UNSUPPORTED_FETCHER} from "../errors"
import {impact} from "../runtimes/server"
import {impact as impactBrowser} from "../runtimes/client"
import {parseData} from "../utils"

t.test("errors", t => {
  t.plan(8)

  t.test("should throw an error when the data is not a valid JSON", t => {
    t.plan(1)

    const endpoint = "https://raw.githubusercontent.com/falsy/pokemon.json/falsy/pokedex.json"

    impact(endpoint).catch(err => {
      t.equal(err.message, RESPONSE_INVALID(endpoint, 404, "Not Found"))
    })
  })

  t.test("should throw an error with invalid fetcher", t => {
    t.plan(1)

    impact("https://rickandmortyapi.com/graphql", {
      fetch: {
        // @ts-expect-error invalid fetcher
        fetcher: "invalid"
      }
    }).catch(err => {
      t.equal(err.message, UNSUPPORTED_FETCHER("invalid"))
    })
  })

  t.test("should throw an error when the content type is not supported", t => {
    t.plan(1)

    impact("https://www.w3schools.com/xml/simple.xml").catch(err => {
      t.equal(err.message, UNSUPPORTED_CONTENT_TYPE("text/xml"))
    })
  })

  t.test("should throw an errors with missing graphql query", t => {
    t.plan(1)

    impact("https://rickandmortyapi.com/graphql", {
      fetch: {
        fetcher: "graphql"
      }
    }).catch(err => {
      t.equal(err.message, MISSING_GRAPHQL_QUERY())
    })
  })

  t.test("should throw an error when the file does not exist", t => {
    t.plan(1)

    const path = "./src/tests/invalid.json"
    impact(path, {
      fetch: {
        fetcher: "filesystem"
      }
    }).catch(err => {
      t.equal(err.message, FILE_NOT_FOUND(path))
    })
  })

  t.test("filesystem fetcher is not supported in browser", t => {
    t.plan(1)

    impactBrowser("./package.json", {
      fetch: {
        fetcher: "filesystem"
      }
    }).catch(err => {
      t.equal(err.message, FILESYSTEM_NOT_SUPPORTED())
    })
  })

  t.test("should throw an error when the response status code is not OK", t => {
    t.plan(1)

    impact("https://httpbin.org/status/404").catch(err => {
      t.equal(err.message, RESPONSE_INVALID("https://httpbin.org/status/404", 404, "NOT FOUND"))
    })
  })

  t.test("should throw an error when contentType is not supported", t => {
    t.plan(1)

    try {
      parseData("test", {contentType: "invalid"})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      t.equal(err.message, UNSUPPORTED_CONTENT_TYPE("invalid"))
    }
  })
})
