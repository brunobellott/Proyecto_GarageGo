const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brunolacade@gmail.com",
    pass: "gihv evnt vjwi ssrn"
  }
});
transporter.verify((error, success) => {

  if (error) {

    console.log(error);

  } else {

    console.log("Servidor de correo listo");
  }
});

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
  const { nombre, apellido, email, password } = req.body;

  try {
    const existe = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    if (existe.rows.length > 0) {
      return res.json({ success: false, message: "Email ya existe" });
    }

    await pool.query(
      "INSERT INTO usuario (nombre, apellido, email, password) VALUES ($1, $2, $3, $4)",
      [nombre, apellido, email, password]
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
// ENVIAR CODIGO
// =========================

app.post("/enviar-codigo", async (req, res) => {

  const { email } = req.body;

  try {

    const user = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {

      return res.json({
        success: false,
        message: "Email no encontrado"
      });
    }

    const codigo =
      Math.floor(100000 + Math.random() * 900000)
        .toString();

    console.log(email);
    console.log(codigo);

    await pool.query(
      `UPDATE usuario
   SET codigo_recuperacion = $1
   WHERE email = $2`,
      [codigo, email]
    );

    await transporter.sendMail({
      from: "Garagego",
      to: email,
      subject: "Código recuperación",
      text: `Tu código es: ${codigo}`
    });

    console.log("Mail enviado");

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false
    });
  }
});

// =========================
// VERIFICAR CODIGO
// =========================v

app.post("/verificar-codigo", async (req, res) => {

  const { email, codigo } = req.body;

  console.log(email);
  console.log(codigo);

  try {

    const result = await pool.query(
      `SELECT * FROM usuario
       WHERE email = $1
       AND codigo_recuperacion = $2`,
      [email, codigo]
    );

    console.log(result.rows);

    if (result.rows.length > 0) {

      res.json({
        success: true
      });

    } else {

      res.json({
        success: false
      });
    }

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false
    });
  }
});

// =========================
// NUEVA CONTRASEÑA
// =========================

app.post("/nueva-password", async (req, res) => {

  const { email, password } = req.body;

  try {

    await pool.query(
      `UPDATE usuario
       SET password = $1,
       codigo_recuperacion = NULL
       WHERE email = $2`,
      [password, email]
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false
    });
  }
});


// =========================
// INICIAR SERVIDOR 
// =========================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});