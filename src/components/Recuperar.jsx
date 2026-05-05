export default function Recuperar() {
  return (
    <div className="container">

      <img src="src/assets/img/logo.png" className="logo" />

      <h2>RECUPERAR CONTRASEÑA</h2>

      <input type="email" placeholder="MAIL" />
      <input type="text" placeholder="USUARIO" />

      <button className="btn">ENVIAR CÓDIGO</button>

      <button className="btn gris" onClick={() => window.location.href="/"}>
        VOLVER
      </button>

    </div>
  );
}