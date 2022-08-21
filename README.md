# 🌍☄️️ Impact 

Convert an API into a [Lyra](https://github.com/nearform/lyra) instance.

## Usage

```js
(async () => {
  impact("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json").then((lyra) => {
    const { hits } = search(lyra, {
      term: "pikachu"
    })

    console.log(hits)
  });
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
