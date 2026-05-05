export default function Registro() {
  return (
    <div className="container">

      <img src="src/assets/img/logo.png" className="logo" />

      <h2>REGISTRO</h2>

      <input type="email" placeholder="MAIL" />
      <input type="text" placeholder="USUARIO" />
      <input type="password" placeholder="CONTRASEÑA" />

      <button className="btn">CREAR CUENTA</button>

      <button className="btn gris" onClick={() => window.location.href="/"}>
        VOLVER
      </button>

    </div>
  );
}