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

/* MIGRACIÓN: relacionar productos con proveedores */
pool
  .query(
    `ALTER TABLE productos ADD COLUMN IF NOT EXISTS proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL`,
  )
  .then(() => console.log("✅ Columna proveedor_id verificada en productos"))
  .catch((err) => console.error("❌ Error en migración proveedor_id:", err));

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
