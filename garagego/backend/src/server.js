const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔌 CONEXIÓN A POSTGRESQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "garagego",
  password: "1234",
  port: 5432,
});

// =========================
// REGISTER
// =========================
app.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existe = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    if (existe.rows.length > 0) {
      return res.json({ success: false, message: "Email ya existe" });
    }

    await pool.query(
      "INSERT INTO usuario (nombre, email, password) VALUES ($1, $2, $3)",
      [nombre, email, password]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// =========================
// LOGIN
// =========================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuario WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.json({ success: false, message: "Credenciales incorrectas" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// =========================
// RECUPERAR CONTRASEÑA
// =========================
app.post("/recuperar", async (req, res) => {
  const { email, nuevaPassword } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.json({ success: false, message: "Usuario no existe" });
    }

    await pool.query(
      "UPDATE usuario SET password = $1 WHERE email = $2",
      [nuevaPassword, email]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// =========================
// INICIAR SERVIDOR 
// =========================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});