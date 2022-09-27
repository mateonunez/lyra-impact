import t from "tap"
import {FILE_NOT_FOUND, MISSING_GRAPHQL_QUERY, RESPONSE_INVALID, UNSUPPORTED_CONTENT_TYPE, UNSUPPORTED_FETCHER, UNSUPPORTED_TYPE_SCHEMA} from "../errors"
import {impact} from "../runtimes/server"
import {parseData} from "../utils"
import {resolveSchema} from "../schema/resolver"

t.test("errors", t => {
  t.plan(12)

  t.test("should throw an error when the data is not a valid JSON", t => {
    const endpoint = "https://raw.githubusercontent.com/falsy/pokemon.json/falsy/pokedex.json"

    t.rejects(impact(endpoint), new Error(RESPONSE_INVALID(endpoint, 404)))
    t.end()
  })

  t.test("should throw an error with invalid fetcher", t => {
    impact("https://rickandmortyapi.com/graphql", {
      fetch: {
        // @ts-expect-error invalid fetcher
        fetcher: "invalid"
      }
    }).catch(err => {
      t.equal(err.message, UNSUPPORTED_FETCHER("invalid"))
      t.end()
    })
  })

  t.test("should throw an error when the content type is not supported", t => {
    impact("https://www.w3schools.com/xml/simple.xml").catch(err => {
      t.equal(err.message, UNSUPPORTED_CONTENT_TYPE("text/xml"))
      t.end()
    })
  })

  t.test("should throw an error when the content type is not supported", t => {
    t.throws(
      () => {
        parseData("invalid", {contentType: "text/pokemon"})
      },
      {message: UNSUPPORTED_CONTENT_TYPE("text/pokemon")}
    )
    t.end()
  })

  t.test("should throw an errors with missing graphql query", t => {
    impact("https://rickandmortyapi.com/graphql", {
      fetch: {
        fetcher: "graphql"
      }
    }).catch(err => {
      t.equal(err.message, MISSING_GRAPHQL_QUERY())
      t.end()
    })
  })

  t.test("should throw an error when the file does not exist", t => {
    const path = "./src/tests/invalid.json"
    impact(path, {
      fetch: {
        fetcher: "filesystem"
      }
    }).catch(err => {
      t.equal(err.message, FILE_NOT_FOUND(path))
      t.end()
    })
  })

  t.test("should throw an error when the response status code is not OK", t => {
    impact("https://httpbin.org/status/404").catch(err => {
      t.equal(err.message, RESPONSE_INVALID("https://httpbin.org/status/404", 404))
      t.end()
    })
  })

  t.test("should throw an error when contentType is not supported", t => {
    try {
      parseData("test", {contentType: "invalid"})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      t.equal(err.message, UNSUPPORTED_CONTENT_TYPE("invalid"))
      t.end()
    }
  })

  t.test("should throw an error when the schema is not valid", t => {
    try {
      const data = {
        username: "mateonunez",
        description: () => ({})
      }

      resolveSchema({}, data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      t.equal(err.message, UNSUPPORTED_TYPE_SCHEMA("function"))
      t.end()
    }
  })

  t.test("parsing xml data should throw an error", t => {
    const data = `<?xml version="1.0" encoding="UTF-8"?>
    <note>
      <to>Tove</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>`

    try {
      parseData(data, {extension: "xml"})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      t.equal(err.message, UNSUPPORTED_CONTENT_TYPE("*"))
      t.end()
    }
  })

  t.test("should retrieve an error when the response is invalid using graphql", async t => {
    await impact("https://httpbin.org/status/404", {
      fetch: {
        fetcher: "graphql",
        query: `{}`
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((err: any) => {
      t.equal(err.message, RESPONSE_INVALID("https://httpbin.org/status/404", 404))
      t.end()
    })
  })

  t.test("should retrieve an error when the response is invalid", async t => {
    await impact("https://rickandmortyapi.com/graphql", {
      fetch: {
        // @ts-expect-error invalid fetcher
        fetcher: "invalid"
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((err: any) => {
      t.equal(err.message, UNSUPPORTED_FETCHER("invalid"))
      t.end()
    })
  })
})
