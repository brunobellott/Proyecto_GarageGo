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
// Asegúrate de tener configurado tu cliente de supabase en esta ruta
import { supabaseClient } from "../supabaseClient";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Función para iniciar sesión con Email y Contraseña
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
      Alert.alert("Error de autenticación", error.message);
      return;
    }

    // Navegar a la pantalla principal si usas React Navigation / Expo Router
    // navigation.navigate('Principal');
    Alert.alert("¡Éxito!", "Sesión iniciada correctamente.");
  };

  // Función simulada de Google (Requiere configuración adicional de Supabase Auth en móviles)
  const iniciarSesionConGoogle = async () => {
    Alert.alert(
      "Info",
      "La autenticación de Google requiere configurar un proveedor OAuth en Expo.",
    );
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

          <Text style={styles.titulo}>INICIAR SESIÓN</Text>

          {/* BOTÓN GOOGLE */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={iniciarSesionConGoogle}
          >
            <Image
              source={require("../../assets/images/icons/google.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleBtnText}>CONTINUAR CON GOOGLE</Text>
          </TouchableOpacity>

          {/* INPUT EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#f5b800"
            keyboardType="email-address"
            autoCapitalize="characters" // Mantiene el comportamiento uppercase visual de tu CSS
            value={email}
            onChangeText={setEmail}
          />

          {/* CONTENEDOR PASSWORD */}
          <View style={styles.contenedorPassword}>
            <TextInput
              style={[styles.input, styles.inputPassword]}
              placeholder="CONTRASEÑA"
              placeholderTextColor="#f5b800"
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.btnPassword}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <Text style={styles.eyeIcon}>
                {secureTextEntry ? "👁️" : "🙈"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* BOTÓN ACCEDER */}
          <TouchableOpacity style={styles.boton} onPress={handleLogin}>
            <Text style={styles.botonText}>ACCEDER</Text>
          </TouchableOpacity>

          {/* BOTÓN REGISTRARSE */}
          <TouchableOpacity
            style={[styles.boton, styles.botonSecundario]}
            onPress={() => {
              /* navigation.navigate('Registro') */
            }}
          >
            <Text style={styles.botonText}>REGISTRARSE</Text>
          </TouchableOpacity>

          {/* LINK OLVIDÓ CONTRASEÑA */}
          <TouchableOpacity
            style={styles.registroLink}
            onPress={() => {
              /* navigation.navigate('Recuperar') */
            }}
          >
            <Text style={styles.registroLinkText}>¿OLVIDÓ SU CONTRASEÑA?</Text>
          </TouchableOpacity>
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
    height: 100, // Ajusta la altura según las proporciones de tu logo
    marginBottom: 20,
  },
  titulo: {
    color: "#f5b800",
    fontSize: 26,
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
    // Reemplazo de box-shadow para Android e iOS
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  contenedorPassword: {
    width: "100%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputPassword: {
    paddingRight: 60,
  },
  btnPassword: {
    position: "absolute",
    right: 15,
    height: "100%",
    justifyContent: "center",
    bottom: 9, // Centrado óptico respecto al margen inferior del input
  },
  eyeIcon: {
    fontSize: 18,
  },
  googleBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  googleBtnText: {
    fontWeight: "bold",
    color: "#f5b800",
  },
  boton: {
    width: "100%",
    padding: 16,
    borderRadius: 30,
    backgroundColor: "#f5b800", // Nota: React Native no soporta gradientes de forma nativa sin librerías externas.
    alignItems: "center",
    marginTop: 12,
    elevation: 5,
    shadowColor: "#f5b800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  botonSecundario: {
    backgroundColor: "#7a7a7a",
    shadowColor: "#000",
  },
  botonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  registroLink: {
    marginTop: 15,
  },
  registroLinkText: {
    fontSize: 12,
    color: "#555",
    textDecorationLine: "underline",
  },
});
