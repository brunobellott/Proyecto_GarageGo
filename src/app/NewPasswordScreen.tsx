import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Usamos los iconos integrados de Expo (Ionicons para el ojito del password)
import { Ionicons } from "@expo/vector-icons";
import { supabaseClient } from "../supabaseClient";

export default function NewPasswordScreen({ navigation }: any) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para controlar la visibilidad de los campos de texto de manera independiente
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const handleUpdatePassword = async () => {
    // Validaciones básicas antes de enviar
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Por favor, completa ambos campos.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      // Llamada oficial a Supabase Auth para actualizar el usuario actual
      const { error } = await supabaseClient.auth.updateUser({
        password: password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert(
        "¡Éxito!",
        "Tu contraseña ha sido actualizada correctamente.",
        [
          {
            text: "OK",
            onPress: () => {
              // navigation.navigate('Login'); // Descomenta al integrar la navegación
            },
          },
        ],
      );
    } catch (err) {
      Alert.alert(
        "Error",
        "Hubo un problema al intentar actualizar la contraseña.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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

            <Text style={styles.titulo}>NUEVA CONTRASEÑA</Text>

            {/* INPUT NUEVA PASSWORD */}
            <View style={styles.contenedorPassword}>
              <TextInput
                style={styles.input}
                placeholder="NUEVA CONTRASEÑA"
                placeholderTextColor="#f5b800"
                secureTextEntry={securePassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.btnPassword}
                onPress={() => setSecurePassword(!securePassword)}
              >
                <Ionicons
                  name={securePassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#f5b800"
                />
              </TouchableOpacity>
            </View>

            {/* INPUT CONFIRMAR PASSWORD */}
            <View style={styles.contenedorPassword}>
              <TextInput
                style={styles.input}
                placeholder="CONFIRMAR CONTRASEÑA"
                placeholderTextColor="#f5b800"
                secureTextEntry={secureConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.btnPassword}
                onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
              >
                <Ionicons
                  name={
                    secureConfirmPassword ? "eye-off-outline" : "eye-outline"
                  }
                  size={22}
                  color="#f5b800"
                />
              </TouchableOpacity>
            </View>

            {/* BOTÓN SUBMIT */}
            <TouchableOpacity
              style={styles.boton}
              onPress={handleUpdatePassword}
            >
              <Text style={styles.botonText}>CAMBIAR CONTRASEÑA</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 30,
    textAlign: "center",
  },
  contenedorPassword: {
    width: "100%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    marginBottom: 18,
    paddingHorizontal: 16,
    height: 55,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#000",
  },
  btnPassword: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  boton: {
    width: "100%",
    padding: 16,
    borderRadius: 30,
    backgroundColor: "#f5b800",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#f5b800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: 10,
  },
  botonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
