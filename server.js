import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CAMBIO IMPORTANTE ---
// Azure te asigna un puerto dinámico. Debes usar process.env.PORT.
// Si no existe (como en tu PC), usa el 3000.
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (html, js, css, icons, manifest, etc.)
app.use(express.static(__dirname));

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});