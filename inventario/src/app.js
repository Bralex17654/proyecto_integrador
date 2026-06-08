import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

/* MIDDLEWARES */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);

app.use("/api/productos", productosRoutes);

app.use("/api/ventas", ventasRoutes);

app.use("/api/clientes", clientesRoutes);

app.use("/api/proveedores", proveedoresRoutes);

app.use("/api/dashboard", dashboardRoutes);

export default app;
