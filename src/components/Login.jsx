
export default function Login() {
  return (
    <div className="container">

      <img src="src/assets/img/logo.png" className="logo" />

      <h2>INICIAR SESIÓN</h2>

      <input type="text" placeholder="USUARIO" />
      <input type="password" placeholder="CONTRASEÑA" />

      <button className="btn">ACCEDER</button>

      <button className="btn gris" onClick={() => window.location.href="/registro"}>
        REGISTRARSE
      </button>

      <p className="link" onClick={() => window.location.href="/recuperar"}>
        ¿OLVIDÓ SU CONTRASEÑA?
      </p>

    </div>
  );
}