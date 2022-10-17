/* eslint-disable @typescript-eslint/no-explicit-any */
import {test} from "tap"
import {FILE_NOT_FOUND, MISSING_GRAPHQL_QUERY, RESPONSE_INVALID, UNSUPPORTED_CONTENT_TYPE, UNSUPPORTED_FETCHER} from "../errors"
import {impact} from "../runtimes/server"

const rickAndMorty = "https://rickandmortyapi.com/api/character"
const xml = "https://www.w3schools.com/xml/simple.xml"

test("errors - runtime server", ({test, plan}) => {
  plan(1)

  test("fetchers", ({test, plan}) => {
    plan(4)

    test("invalid fetcher is not supported", ({rejects, end}) => {
      rejects(impact(rickAndMorty, {fetch: {fetcher: "invalid" as any}}), new Error(UNSUPPORTED_FETCHER("invalid")))
      end()
    })

    test("invalid response should throw an error", ({test, plan}) => {
      plan(3)

      test("rest", ({rejects, end}) => {
        rejects(impact("https://httpstat.us/500"), new Error(RESPONSE_INVALID("https://httpstat.us/500", 500)))
        end()
      })

      test("graphql", ({rejects, end}) => {
        rejects(impact("https://httpstat.us/500", {fetch: {fetcher: "graphql", query: "invalid"}}), new Error(RESPONSE_INVALID("https://httpstat.us/500", 500)))
        end()
      })

      test("filesystem", ({rejects, end}) => {
        rejects(impact("invalid", {fetch: {fetcher: "filesystem"}}), new Error(FILE_NOT_FOUND("invalid")))
        end()
      })
    })

    test("missing query should thrown an error in graphql", ({rejects, end}) => {
      rejects(impact("https://rickandmortyapi.com/graphql", {fetch: {fetcher: "graphql"}}), new Error(MISSING_GRAPHQL_QUERY()))
      end()
    })

    test("invalid content type should throw an error", ({test, plan}) => {
      plan(2)

      test("rest", ({rejects, end}) => {
        rejects(impact(xml), new Error(UNSUPPORTED_CONTENT_TYPE("text/xml")))
        end()
      })

      test("filesystem", ({rejects, end}) => {
        rejects(impact("./github/workflows/ci.yml", {fetch: {fetcher: "filesystem"}}))
        end()
      })
    })
  })
})
