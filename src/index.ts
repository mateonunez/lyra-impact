import { Lyra, PropertiesSchema, create, search } from "@nearform/lyra";
import fetcher from "./common/fetcher";
import { resolveSchema } from "./common/schema";
import { recursiveInsert } from "./common/utils";

export async function impact<T extends PropertiesSchema> (url: string): Promise<Lyra<T>> {
  const {results} = await fetcher(url);

  const schema = resolveSchema({}, results);

  const lyra = create({
    schema,
    defaultLanguage: "english",
  });

  for (const entry of results) {
    recursiveInsert(lyra, entry);
  }

  return lyra as unknown as Lyra<T>;
}

(async () => {
  impact("https://rickandmortyapi.com/api/character/").then((lyra) => {
    const search2 = search(lyra, {
      term: "Rick",
    })

    console.log(search2)
  });
})();
