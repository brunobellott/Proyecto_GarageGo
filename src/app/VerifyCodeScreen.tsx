import { useRef, useState } from "react";
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
// Importamos correctamente los iconos nativos de Expo
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Para usar AsyncStorage recuerda instalarlo antes con: npx expo install @react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyCodeScreen({ navigation, route }: any) {
  // 1. Estados para los 6 inputs de código
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);

  // 2. SOLUCIÓN: Cambiado a un array flexible 'any[]' para evitar que falle al limpiar/actualizar las celdas
  const inputRefs = useRef<any[]>([]);

  // 3. Captura segura del email protegiendo si 'route' o 'route.params' llega indefinido
  const emailRecuperacion = route?.params?.email
    ? route.params.email
    : "tu-correo@ejemplo.com";

  // Lógica para detectar cuando el usuario escribe un número
  const handleChangeText = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, ""); // Solo números
    const newCode = [...code];
    newCode[index] = cleanText;
    setCode(newCode);

    // Mueve el foco al casillero de la derecha automáticamente
    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Lógica para detectar cuando el usuario borra con el teclado
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Acción del botón VERIFICAR
  const handleVerifyCode = async () => {
    const stringCodigo = code.join("");

    if (stringCodigo.length < 6) {
      Alert.alert(
        "Error",
        "Por favor introduce el código completo de 6 dígitos.",
      );
      return;
    }

    try {
      const emailStorage =
        (await AsyncStorage.getItem("emailRecuperacion")) || emailRecuperacion;

      // Configuración de endpoints locales (Evita localhost en emuladores de Android)
      const urlBack =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";

      const res = await fetch(`${urlBack}/verificar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailStorage, codigo: stringCodigo }),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Éxito", "Código correcto", [
          {
            text: "OK",
            onPress: () => {
              // navigation.navigate('NuevaPassword'); // Conecta aquí tu navegación
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          "Código incorrecto. Verifica los números ingresados.",
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor.");
    }
  };

  // Acción del botón REENVIAR
  const handleResendCode = () => {
    Alert.alert("Reenviar", "Se ha vuelto a enviar el código de verificación.");
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
            {/* LOGO - Corregido con la ruta real hacia la carpeta assets */}
            <Image
              source={require("../../assets/images/icons/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* AVISO DEL ENVÍO - Reemplazado por icono nativo de Gmail en alta definición */}
            <View style={styles.containerMail}>
              <Text style={styles.recuperarContrasena}>
                Hemos enviado un código de verificación a su correo electrónico.
              </Text>
              <MaterialCommunityIcons name="gmail" size={35} color="#EA4335" />
            </View>

            <Text style={styles.subtitulo}>INTRODUCE EL CÓDIGO</Text>

            {/* CONTENEDOR DE INPUTS 6 DÍGITOS */}
            <View style={styles.codigoContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  // SOLUCIÓN: Condicional seguro para evitar guardar valores nulos intermedios
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  style={styles.inputCodigo}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* BOTÓN VERIFICAR */}
            <TouchableOpacity style={styles.boton} onPress={handleVerifyCode}>
              <Text style={styles.botonText}>VERIFICAR</Text>
            </TouchableOpacity>

            {/* REENVIAR */}
            <TouchableOpacity
              onPress={handleResendCode}
              style={styles.btnReenviar}
            >
              <Text style={styles.textReenviar}>VOLVER A ENVIAR EL CÓDIGO</Text>
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
    maxWidth: 360,
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  containerMail: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 20,
    gap: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#eee",
  },
  recuperarContrasena: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  subtitulo: {
    color: "#f5b800",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: "center",
  },
  codigoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 35,
    gap: 8,
  },
  inputCodigo: {
    flex: 1,
    height: 52,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
    marginBottom: 25,
  },
  botonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  btnReenviar: {
    padding: 10,
  },
  textReenviar: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
