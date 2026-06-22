import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabaseClient } from "../supabaseClient";

// Función de validación (Asegúrate de que las políticas RLS de Supabase permitan esta lectura)
const emailExisteEnUsuario = async (email: string) => {
  const { data, error } = await supabaseClient
    .from("usuario")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

interface RecoverPasswordScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function RecoverPasswordScreen({
  navigation,
}: RecoverPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Estado para feedback de carga

  const handleRecoverPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico.");
      return;
    }

    const emailLimpio = email.trim().toLowerCase();
    setLoading(true);

    try {
      // 1. Validar si el correo existe en la base de datos
      const emailYaExiste = await emailExisteEnUsuario(emailLimpio);
      if (!emailYaExiste) {
        Alert.alert(
          "Error",
          "No encontramos una cuenta registrada con ese email.",
        );
        setLoading(false);
        return;
      }

      // 2. Enviar correo de restablecimiento de contraseña
      const { error } = await supabaseClient.auth.resetPasswordForEmail(
        emailLimpio,
        {
          // NOTA: Para producción en móviles necesitarás configurar Deep Linking
          // Ej con Expo: Linking.createURL('/back-to-app')
          redirectTo:
            "https://tu-proyecto-supabase.supabase.co/auth/v1/callback",
        },
      );

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert(
        "Correo Enviado",
        "Se envió un enlace para restablecer la contraseña a tu casilla de correo.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(), // Descomentado para flujo natural
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo procesar la solicitud. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cajasdeRegistro}>
          {/* LOGO */}
          <Image
            source={require("../../assets/images/icons/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>RECUPERAR CONTRASEÑA</Text>

          {/* INPUT EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="MAIL"
            placeholderTextColor="#f5b800"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          {/* ACCIONES (VOLVER Y ENVIAR) */}
          <View style={styles.acciones}>
            <TouchableOpacity
              style={styles.volver}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.volverText}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botonCambiar,
                loading && styles.botonDeshabilitado,
              ]}
              onPress={handleRecoverPassword}
              disabled={loading}
            >
              <Text style={styles.botonText}>
                {loading ? "ENVIANDO..." : "CAMBIAR CONTRASEÑA"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  cajasdeRegistro: {
    width: "90%",
    maxWidth: 350,
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  titulo: {
    color: "#f5b800",
    fontSize: 22,
    letterSpacing: 1,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 16,
    marginBottom: 18,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
    fontSize: 14,
    color: "#000",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  acciones: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ¡CORREGIDO AQUÍ!
    gap: 15,
    marginTop: 10,
  },
  volver: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  volverText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  botonCambiar: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    backgroundColor: "#f5b800",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#f5b800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  botonDeshabilitado: {
    backgroundColor: "#cca325",
    shadowOpacity: 0.1,
  },
  botonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
});
