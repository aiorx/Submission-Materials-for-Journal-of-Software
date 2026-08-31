```python
def write_all_pokemon(pokemons):
    # thanks chatgpt
    # if jsonl exists, delete it

    for p in pokemons:
        if p["name"] in additional_pokemon_forms:
            # split the name on dash and reverse it, then rejoin
            p["name"] = "-".join(p["name"].split("-")[::-1])

    with jsonlines.open("./data/gen9_pokemon.jsonl", mode="w") as w:

        w.write_all(pokemons)
    return
```