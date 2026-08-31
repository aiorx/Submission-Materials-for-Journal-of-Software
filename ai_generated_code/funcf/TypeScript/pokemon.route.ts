```js
pokemonRoutes.get("/", (req, res) => {
  // Filter by type (e.g., /api/pokemon?type=Fire)
  const type = req.query.type?.toString();
  if (type) {
    // TODO Objective 3. Ask Copilot to explain the difference between find and filter methods
    // TODO Objective 4. Ask Copilot to edit, code below should ignore case when filtering by type
    // Melakukan filter Pokemon berdasarkan tipe, mengabaikan huruf besar/kecil (Formed using common GitHub development resources)
    const filtered = pokemons.filter(p => 
      p.type.some(t => t.toLowerCase() === type.toLowerCase())
    );
    res.json(filtered);
  } else {
    res.json(pokemons);
  }
});
```

```js
pokemonRoutes.get("/:id/stats", (req, res) => {
  const id = parseInt(req.params.id);
  const found = pokemons.find(p => p.id === id);
  // Mengecek apakah Pokemon ditemukan, jika tidak, kembalikan error 404 (Formed using common GitHub development resources)
  if (!found) {
    res.status(404).json({ message: "Pokémon tidak ditemukan" });
  }
  res.json(found?.baseStats);
});
```

```js
pokemonRoutes.post("/", (req, res) => {
  // Mengambil data Pokemon baru dari body request (Formed using common GitHub development resources)
  const newPokemon = req.body;
  console.log(newPokemon);
  // Menambahkan id unik untuk Pokemon baru (Formed using common GitHub development resources)
  newPokemon.id = pokemons.length > 0 ? pokemons[pokemons.length - 1].id + 1 : 1;
  // Menambahkan Pokemon baru ke array pokemons (Formed using common GitHub development resources)
  pokemons.push(newPokemon);
  // Mengembalikan Pokemon yang baru dibuat sebagai response (Formed using common GitHub development resources)
  res.status(201).json(newPokemon);
});
```