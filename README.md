# 🌍☄️️ Impact 

Convert an API into a [Lyra](https://github.com/nearform/lyra) instance.

## Usage

```js
import { impact } from "@mateonunez/lyra-impact";

(async () => {
  impact("https://rickandmortyapi.com/api/character/").then((lyra) => {
    const search2 = search(lyra, {
      term: "Rick",
    })

    console.log(search2)
  });
})();
```

**Result**
```js
{
  elapsed: 191100n,
  hits: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: [Object],
      location: [Object],
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [Array],
      url: 'https://rickandmortyapi.com/api/character/1',
      created: '2017-11-04T18:48:46.250Z'
    },
    {
      id: 8,
      name: 'Adjudicator Rick',
      status: 'Dead',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: [Object],
      location: [Object],
      image: 'https://rickandmortyapi.com/api/character/avatar/8.jpeg',
      episode: [Array],
      url: 'https://rickandmortyapi.com/api/character/8',
      created: '2017-11-04T20:03:34.737Z'
    },
    {
      id: 15,
      name: 'Alien Rick',
      status: 'unknown',
      species: 'Alien',
      type: '',
      gender: 'Male',
      origin: [Object],
      location: [Object],
      image: 'https://rickandmortyapi.com/api/character/avatar/15.jpeg',
      episode: [Array],
      url: 'https://rickandmortyapi.com/api/character/15',
      created: '2017-11-04T20:56:13.215Z'
    },
    {
      id: 19,
      name: 'Antenna Rick',
      status: 'unknown',
      species: 'Human',
      type: 'Human with antennae',
      gender: 'Male',
      origin: [Object],
      location: [Object],
      image: 'https://rickandmortyapi.com/api/character/avatar/19.jpeg',
      episode: [Array],
    },
  ],
  count: 4
}
```

# License

[Apache-2.0](/LICENSE.md)
