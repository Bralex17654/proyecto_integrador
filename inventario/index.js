import app from "./src/app.js";
import { pool } from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

/* TEST DB */
pool
  .query("SELECT 1")
  .then(() => {
    console.log("✅ PostgreSQL (Neon) conectado");
  })
  .catch((err) => {
    console.error("❌ Error PostgreSQL:", err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
