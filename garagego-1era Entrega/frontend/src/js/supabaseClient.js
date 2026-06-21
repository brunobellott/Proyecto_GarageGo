const supabaseUrl =
  "https://osoaswcekympiqumpcnc.supabase.co";

const supabaseKey =
  "sb_publishable_ZUkfOyK172bO9ZxQhva9QQ_Y2z8KFf6";

const supabaseClient =
  window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

const googleCallbackUrl =
  "http://127.0.0.1:5500/frontend/src/pages/google-callback.html";

async function iniciarSesionConGoogle() {
  const { error } =
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: googleCallbackUrl
      }
    });

  if (error) {
    alert(error.message);
  }
}

async function emailExisteEnUsuario(email) {
  const emailNormalizado =
    email.trim().toLowerCase();

  const { data, error } =
    await supabaseClient
      .from("usuario")
      .select("email")
      .eq("email", emailNormalizado)
      .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  return data.length > 0;
}

async function protegerPaginaPrincipal() {
  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error || !session) {
    window.location.replace("index.html");
    return null;
  }

  return session;
}

function activarProteccionPaginaPrincipal() {
  protegerPaginaPrincipal();

  window.addEventListener("pageshow", () => {
    protegerPaginaPrincipal();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      protegerPaginaPrincipal();
    }
  });
}

async function cerrarSesion() {
  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    console.error(error);
    alert(error.message);
  }

  window.location.replace("index.html");
}
