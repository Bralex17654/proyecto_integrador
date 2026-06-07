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
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const [rows] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [
      correo,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const usuario = rows[0];

    const passwordValido = await bcrypt.compare(password, usuario.Password);

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.Id,
        correo: usuario.Correo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.Id,
        nombre: usuario.Nombre,
        correo: usuario.Correo,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error en login",
      error: error.message,
    });
  }
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    /* VERIFICAR USUARIO */

    const [rows] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [
      correo,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });
    }

    /* HASH PASSWORD */

    const hash = await bcrypt.hash(password, 10);

    /* INSERTAR */

    const [result] = await pool.query(
      `INSERT INTO usuario
      (nombre, correo, password)
      VALUES (?, ?, ?)`,
      [nombre, correo, hash],
    );

    /* TOKEN */

    const token = jwt.sign(
      {
        id: result.insertId,
        correo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",

      token,

      usuario: {
        id: result.insertId,
        nombre,
        correo,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al registrar",
      error: error.message,
    });
  }
};
