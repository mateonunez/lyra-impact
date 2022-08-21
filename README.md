# 🌍☄️️ Impact 

Create a [Lyra](https://github.com/nearform/lyra) instance from an API response

[![Tests](https://github.com/mateonunez/lyra-impact/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mateonunez/lyra-impact/actions/workflows/ci.yml)


## Usage

```js
import { search } from "@nearform/lyra"
import { impact } from "@mateonunez/lyra-impact"

(async () => {
  const lyra = await impact("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")

  const { hits } = search(lyra, {
    term: "pikachu"
  })

  console.log(hits)
})();
```

**Result**
```js
[
  {
    id: 25,
    name: {
      english: 'Pikachu',
      japanese: 'ピカチュウ',
      chinese: '皮卡丘',
      french: 'Pikachu'
    },
    type: [ 'Electric' ],
    base: {
      HP: 35,
      Attack: 55,
      Defense: 40,
      'Sp. Attack': 50,
      'Sp. Defense': 50,
      Speed: 90
    }
  },
];

```

# License

[MIT](/LICENSE)
