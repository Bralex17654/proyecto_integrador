import app from "./src/app.js";
import { pool } from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

/* TEST DB */
pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL conectado");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Error PostgreSQL:", err);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
