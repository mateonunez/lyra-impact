# 🌍☄️️ Impact 

Create a [Lyra](https://github.com/nearform/lyra) database from anywhere.

[![Tests](https://github.com/mateonunez/lyra-impact/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mateonunez/lyra-impact/actions/workflows/ci.yml)

## Installation

You can install Lyra using `npm`, `yarn`, `pnpm`:

```sh
npm i @mateonunez/lyra-impact
```
```sh
yarn add @mateonunez/lyra-impact
```
```sh
pnpm add @mateonunez/lyra-impact
```

## Examples

See the full list of examples: [mateonunez/lyra-impact-examples](https://github.com/mateonunez/lyra-impact-examples)

- [React](https://lyra-impact-examples-with-react.vercel.app/)
- [Vue](https://lyra-impact-examples-with-vue.vercel.app/)

## Usage

```js
import { search } from "@lyrasearch/lyra"
import { impact } from "@mateonunez/lyra-impact"

(async () => {
  const endpoint = "https://raw.githubusercontent.com/LyraSearch/lyra/main/examples/with-vue/public/pokedex.json"
  const lyra = await impact(endpoint)

  const { hits } = search(lyra, {
    term: "pikachu",
    properties: ["name"]
  })

  console.log(hits)
})();
```

**Result**
```js
[
  {
    num: '025',
    name: 'Pikachu',
    img: 'http://www.serebii.net/pokemongo/pokemon/025.png',
    type: [ 'Electric' ],
    height: '0.41 m',
    weight: '6.0 kg',
    candy: 'Pikachu Candy',
    candy_count: 50,
    egg: '2 km',
    spawn_chance: 0.21,
    avg_spawns: 21,
    spawn_time: '04:00',
    multipliers: [ 2.34 ],
    weaknesses: [ 'Ground' ],
    next_evolution: [ { num: '026', name: 'Raichu' } ]
  }
];
```

## Formats and fetchers

`lyra-impact` supports the following formats and fetchers:

| Format            | Fetcher               | Description                                     |
| ----------------- | --------------------- | ----------------------------------------------- |
| `JSON`            | `fetch`, `filesystem` | Fetches a **JSON** response or file             |
| `GraphQL`         | `graphql`             | Fetches a **GraphQL** endpoint                  |
| `CSV`             | `fetch`, `filesystem` | Fetches a **CSV** file from a URL or filesystem |
| `XML` (_REMOVED_) | `fetch`, `filesystem` | Fetches a **XML** file from a URL or filesystem |

### With GraphQL

```js
import { search } from "@lyrasearch/lyra"
import { impact } from "@mateonunez/lyra-impact"

(async () => {
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

  const { hits } = search(lyra, {
    term: "Morty"
  })

  console.log(hits)
})()
```

### With Filesystem

```js
import { search } from "@lyrasearch/lyra"
import { impact } from "@mateonunez/lyra-impact"

(async () => {
  const lyra = await impact("./data/examples/characters.csv", {
    fetch: {
      fetcher: "filesystem"
    }
  })

  const { hits } = search(lyra, {
    term: "Morty"
  })

  console.log(hits)
})()
```

### Collision

`collision` method allows you to fetch and search a **term** in the API results.

- `url: string`
- `searchOptions: SearchOptions`
- `impactOptions: ImpactOptions`

```js
import { collision } from "@mateonunez/lyra-impact"

(async () => {
  const endpoint = "https://raw.githubusercontent.com/LyraSearch/lyra/main/examples/with-vue/public/pokedex.json"
  const { hits } = await collision(endpoint, {
      term: "pikachu",
      properties: ["name"]
    }
  )

  console.log(hits)
})();
```

**Result**
```js
[
  {
    num: '025',
    name: 'Pikachu',
    img: 'http://www.serebii.net/pokemongo/pokemon/025.png',
    type: [ 'Electric' ],
    height: '0.41 m',
    weight: '6.0 kg',
    candy: 'Pikachu Candy',
    candy_count: 50,
    egg: '2 km',
    spawn_chance: 0.21,
    avg_spawns: 21,
    spawn_time: '04:00',
    multipliers: [ 2.34 ],
    weaknesses: [ 'Ground' ],
    next_evolution: [ { num: '026', name: 'Raichu' } ]
  }
];

```

# License

[MIT](/LICENSE)
