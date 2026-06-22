import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Importamos los iconos vectoriales nativos de Expo de forma correcta
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { supabaseClient } from "../supabaseClient";

// Nota: Deberás tener esta función definida en tu lógica de Supabase o migrarla a tu archivo cliente.
const emailExisteEnUsuario = async (email: string) => {
  const { data, error } = await supabaseClient
    .from("usuario")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export default function RegisterScreen({ navigation }: any) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [terminos, setTerminos] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (!terminos) {
      Alert.alert(
        "Términos y Condiciones",
        "Debes aceptar los términos y condiciones para registrarte.",
      );
      return;
    }

    const emailLimpio = email.trim().toLowerCase();

    try {
      const emailYaExiste = await emailExisteEnUsuario(emailLimpio);
      if (emailYaExiste) {
        Alert.alert("Error", "Ya existe una cuenta registrada con ese email.");
        return;
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo validar el email. Intenta nuevamente.");
      return;
    }

    // 1. Crear usuario en Supabase Auth con metadatos
    const { data, error } = await supabaseClient.auth.signUp({
      email: emailLimpio,
      password: password,
      options: {
        data: {
          nombre,
          apellido,
        },
      },
    });

    console.log("DATA AUTH:", data);
    if (error) {
      Alert.alert("Error de Registro", error.message);
      return;
    }

    // 2. Guardar datos en la tabla pública 'usuario'
    const { error: errorTabla } = await supabaseClient.from("usuario").insert([
      {
        nombre,
        apellido,
        email: emailLimpio,
        password: null,
        rol: "usuario",
        proveedor: "local",
      },
    ]);

    if (errorTabla) {
      console.error(errorTabla);
      Alert.alert("Error en Base de Datos", errorTabla.message);
      return;
    }

    Alert.alert("¡Éxito!", "Usuario registrado correctamente.", [
      {
        text: "OK",
        onPress: () => {
          // navigation.navigate('Login');
        },
      },
    ]);
  };

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
          {/* LOGO - Corregido apuntando a la ruta real de tu estructura de carpetas */}
          <Image
            source={require("../../assets/images/icons/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>REGISTRO</Text>

          {/* BOTÓN GOOGLE - Solucionado reemplazando la imagen local por el icono nativo FontAwesome */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={iniciarSesionConGoogle}
          >
            <FontAwesome name="google" size={20} color="#f5b800" />
            <Text style={styles.googleBtnText}>INGRESAR CON GOOGLE</Text>
          </TouchableOpacity>

          {/* INPUT NOMBRE */}
          <TextInput
            style={styles.input}
            placeholder="NOMBRE"
            placeholderTextColor="#f5b800"
            autoCapitalize="words"
            maxLength={50}
            value={nombre}
            onChangeText={setNombre}
          />

          {/* INPUT APELLIDO */}
          <TextInput
            style={styles.input}
            placeholder="APELLIDO"
            placeholderTextColor="#f5b800"
            autoCapitalize="words"
            maxLength={50}
            value={apellido}
            onChangeText={setApellido}
          />

          {/* INPUT EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#f5b800"
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={100}
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
              maxLength={64}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.btnPassword}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <Ionicons
                name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#f5b800"
              />
            </TouchableOpacity>
          </View>

          {/* CHECKBOX TÉRMINOS Y CONDICIONES */}
          <View style={styles.contenedorTerminos}>
            <Switch
              trackColor={{ false: "#767577", true: "#f5b800" }}
              thumbColor={terminos ? "#ffffff" : "#f4f3f4"}
              onValueChange={setTerminos}
              value={terminos}
            />
            <Text style={styles.terminosLabel}>
              Acepto los términos y condiciones
            </Text>
          </View>

          {/* ACCIONES (VOLVER Y REGISTRARSE) */}
          <View style={styles.acciones}>
            <TouchableOpacity
              style={styles.volver}
              onPress={() => {
                // navigation.goBack();
                Alert.alert("Volver", "Regresar a la pantalla anterior");
              }}
            >
              <Text style={styles.volverText}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonRegistro}
              onPress={handleRegister}
            >
              <Text style={styles.botonText}>REGISTRARSE</Text>
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
    bottom: 9,
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
  googleBtnText: {
    fontWeight: "bold",
    color: "#f5b800",
  },
  contenedorTerminos: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  terminosLabel: {
    fontSize: 13,
    color: "#555",
    flex: 1,
  },
  acciones: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Corregido: de 'between' a 'space-between'
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
  botonRegistro: {
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
  botonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
