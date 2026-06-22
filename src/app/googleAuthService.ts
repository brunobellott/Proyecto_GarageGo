import { Alert } from "react-native";
import { supabaseClient } from "../supabaseClient";

/**
 * Servicio para procesar y guardar los metadatos de un usuario
 * que ha iniciado sesión a través de Google OAuth en React Native.
 */
export async function guardarUsuarioGoogle(): Promise<boolean> {
  try {
    // 1. Obtener el usuario autenticado actualmente en la sesión de Supabase
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.log("No se encontró una sesión activa de usuario.");
      return false;
    }

    // 2. Extraer y formatear nombre y apellido desde los metadatos de Google
    const nombreCompleto = user.user_metadata?.full_name || "";
    const partes = nombreCompleto.split(" ");
    const nombre = partes[0] || "";
    // Agrupa el resto de las palabras como apellido (ej: "Juan Carlos Pérez" -> Apellido: "Carlos Pérez")
    const apellido = partes.slice(1).join(" ") || "";

    // 3. Comprobar si el usuario ya existe en tu tabla personalizada 'usuario'
    const { data: existe, error: fetchError } = await supabaseClient
      .from("usuario")
      .select("email")
      .eq("email", user.email)
      .maybeSingle(); // Más eficiente que traer un arreglo completo

    if (fetchError) {
      console.error(
        "Error al comprobar la existencia del usuario:",
        fetchError.message,
      );
      return false;
    }

    // 4. Si no existe, lo insertamos siguiendo tu estructura de base de datos
    if (!existe) {
      const { error: insertError } = await supabaseClient
        .from("usuario")
        .insert([
          {
            nombre: nombre,
            apellido: apellido,
            email: user.email,
            password: null, // Al ser OAuth, no almacena contraseña local
            rol: "usuario",
            proveedor: "google",
          },
        ]);

      if (insertError) {
        console.error(
          "Error al registrar el usuario de Google en la tabla:",
          insertError.message,
        );
        Alert.alert("Error", "No se pudieron sincronizar tus datos de perfil.");
        return false;
      }

      console.log(
        "Nuevo usuario de Google registrado con éxito en la tabla 'usuario'.",
      );
    } else {
      console.log("El usuario de Google ya existía en la base de datos.");
    }

    return true; // Proceso completado con éxito
  } catch (error) {
    console.error("Error crítico en guardarUsuarioGoogle:", error);
    return false;
  }
}
