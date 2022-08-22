# 🌍☄️️ Impact 

Create a [Lyra](https://github.com/nearform/lyra) instance from an API response

[![Tests](https://github.com/mateonunez/lyra-impact/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mateonunez/lyra-impact/actions/workflows/ci.yml)


## Usage

```js
import { search } from "@nearform/lyra"
import { impact } from "@mateonunez/lyra-impact"

(async () => {
  const lyra = await impact("https://raw.githubusercontent.com/nearform/lyra/main/packages/examples/with-react/public/pokedex.json", {
    property: "pokemon"
  })

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
    id: 25,
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
