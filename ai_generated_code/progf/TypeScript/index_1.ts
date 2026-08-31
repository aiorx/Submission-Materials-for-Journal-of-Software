import express from "express";
import pokemonRoutes from "./routes/pokemon.route";

const app = express();
const PORT = 3000;

// Middleware untuk memparsing JSON body dari request (Formed using common GitHub development resources)
app.use(express.json());

// Middleware untuk memparsing URL-encoded data dengan extended option (Formed using common GitHub development resources)
app.use(express.urlencoded({ extended: true }));

// Gunakan routes
app.use("/api/pokemon", pokemonRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
