import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const result = await pool.query(
      "SELECT * FROM usuario WHERE correo = $1",
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en login", error: error.message });
  }
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const existe = await pool.query(
      "SELECT id FROM usuario WHERE correo = $1",
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuario (nombre, correo, password)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [nombre, correo, hash]
    );

    const nuevoId = result.rows[0].id;

    const token = jwt.sign(
      { id: nuevoId, correo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: { id: nuevoId, nombre, correo },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar", error: error.message });
  }
};
