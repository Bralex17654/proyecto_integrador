import app from "./src/app.js";
import { pool } from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

/* TEST DB */
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ MySQL conectado");

    connection.release();
  })
  .catch((err) => {
    console.error("❌ Error MySQL:", err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
