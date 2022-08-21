import { search } from "@nearform/lyra";
import t from "tap";
import { impact } from "..";

t.test("should retrieve the data and create a Lyra instance", (t) => {
  t.plan(1);

  impact(
    "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
  ).then((lyra) => {
    const result = search(lyra, {
      term: "pikachu",
    });

    t.equal(result.count, 1);
  });
});
