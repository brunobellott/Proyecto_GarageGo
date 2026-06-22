import { createClient } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { Alert, Platform } from "react-native";

const supabaseUrl = "https://osoaswcekympiqumpcnc.supabase.co";
const supabaseKey = "sb_publishable_ZUkfOyK172bO9ZxQhva9QQ_Y2z8KFf6";

// Crear e exportar el cliente único para toda la app móvil
export const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * 1. INICIAR SESIÓN CON GOOGLE (OAuth en Móviles)
 * Genera un enlace profundo (Deep Link) dinámico para que Google devuelva al usuario a la App.
 */
export async function iniciarSesionConGoogle() {
  try {
    // Genera el esquema de redirección nativo de tu app (ej: garagego://)
    const redirectUrl = Linking.createURL("google-callback");

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false, // Fuerza la apertura segura del navegador nativo
      },
    });

    if (error) throw error;

    // Si estás en entorno Web de Expo, manejamos la URL de datos devuelta
    if (data?.url && Platform.OS === "web") {
      window.location.href = data.url;
    }
  } catch (error: any) {
    Alert.alert("Error de Autenticación", error.message);
  }
}

/**
 * 2. COMPROBAR EXISTENCIA DE EMAIL
 * Valida si el correo ya está registrado en tu tabla personalizada 'usuario'
 */
export async function emailExisteEnUsuario(email: string): Promise<boolean> {
  const emailNormalizado = email.trim().toLowerCase();

  const { data, error } = await supabaseClient
    .from("usuario")
    .select("email")
    .eq("email", emailNormalizado)
    .maybeSingle(); // Más rápido y eficiente que .limit(1) en móviles

  if (error) {
    console.error("Error al validar email:", error.message);
    throw error;
  }

  return !!data;
}

/**
 * 3. OBTENER SESIÓN ACTUAL (Para proteger pantallas puntuales)
 */
export async function obtenerSesionActual() {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}

/**
 * 4. CERRAR SESIÓN NATIVA
 */
export async function cerrarSesion() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error(error);
    Alert.alert("Error", error.message);
  }
}