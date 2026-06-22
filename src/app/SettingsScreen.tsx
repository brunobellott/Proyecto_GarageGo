import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabaseClient } from "../supabaseClient";

export default function SettingsScreen({ navigation }: any) {
  // Estados locales para controlar los switches nativos
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      Alert.alert("Sesión cerrada", "Hasta pronto.");
      // navigation.replace('Login'); // Descomenta al tener tu enrutador listo
    } catch (err) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro? Esta acción es irreversible y perderás todos tus datos de GarageGo.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => console.log("Cuenta eliminada"),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* LISTA DE SWITCHES (CONFIGURACIONES RÁPIDAS) */}
        <View style={styles.settingsList}>
          {/* MODO OSCURO */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color="#555" />
              <Text style={styles.settingLabel}>Modo oscuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#f5b800" }}
              thumbColor={
                Platform.OS === "ios" ? "" : isDarkMode ? "#fff" : "#f4f3f4"
              }
              onValueChange={setIsDarkMode}
              value={isDarkMode}
            />
          </View>

          {/* NOTIFICACIONES */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#555" />
              <Text style={styles.settingLabel}>Notificaciones</Text>
            </View>
            <View style={styles.settingRightGroup}>
              <Text style={styles.statusText}>
                {isNotificationsEnabled ? "Activo" : "Inactivo"}
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#f5b800" }}
                thumbColor={
                  Platform.OS === "ios"
                    ? ""
                    : isNotificationsEnabled
                      ? "#fff"
                      : "#f4f3f4"
                }
                onValueChange={setIsNotificationsEnabled}
                value={isNotificationsEnabled}
              />
            </View>
          </View>
        </View>

        {/* SECCIÓN CONFIGURACIÓN EN CUADRÍCULA (3 COLUMNAS MIGRADO) */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionHeading}>CONFIGURACIÓN</Text>
          <View style={styles.gridOptions}>
            {/* Seguridad */}
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => Alert.alert("Navegación", "Ir a Seguridad")}
            >
              <View style={[styles.gridIcon, styles.color5]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#fff"
                />
              </View>
              <Text style={styles.gridLabel}>Seguridad</Text>
            </TouchableOpacity>

            {/* Soporte y Ayuda */}
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => Alert.alert("Navegación", "Ir a Soporte")}
            >
              <View style={[styles.gridIcon, styles.color6]}>
                <Ionicons name="headset-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.gridLabel}>Soporte y Ayuda</Text>
            </TouchableOpacity>

            {/* Legal */}
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => Alert.alert("Navegación", "Ir a Legal")}
            >
              <View style={[styles.gridIcon, styles.color7]}>
                <Ionicons name="document-text-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.gridLabel}>Legal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACCIONES CRÍTICAS */}
        <View style={styles.profileCriticalOptions}>
          {/* CERRAR SESIÓN */}
          <TouchableOpacity style={styles.criticalItem} onPress={handleLogout}>
            <View style={[styles.criticalIcon, styles.logoutBg]}>
              <Ionicons name="log-out-outline" size={22} color="#ff4d4d" />
            </View>
            <View style={styles.criticalText}>
              <Text style={[styles.criticalLabel, styles.textRed]}>
                Cerrar sesión
              </Text>
              <Text style={styles.criticalDesc}>Hasta pronto</Text>
            </View>
          </TouchableOpacity>

          {/* ELIMINAR CUENTA */}
          <TouchableOpacity
            style={styles.criticalItem}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.criticalIcon, styles.deleteBg]}>
              <Ionicons name="trash-outline" size={22} color="#777" />
            </View>
            <View style={styles.criticalText}>
              <Text style={styles.criticalLabel}>Eliminar cuenta</Text>
              <Text style={styles.criticalDesc}>
                Esta acción es irreversible
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* BOTÓN VOLVER FLOTANTE O INFERIOR */}
        <TouchableOpacity
          style={styles.volver}
          onPress={() => {
            // navigation.goBack();
            Alert.alert("Volver", "Regresar a la pantalla anterior");
          }}
        >
          <Text style={styles.volverText}>←</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  pageHeader: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  settingsList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 30,
    borderWidth: 0.5,
    borderColor: "#eee",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  settingRightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
  profileSection: {
    marginBottom: 30,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
    letterSpacing: 1,
    marginBottom: 15,
  },
  gridOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  gridItem: {
    backgroundColor: "#f9f9f9",
    width: "31%", // Divide equitativamente las tres columnas nativas
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#eee",
  },
  gridIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  color5: { backgroundColor: "#1abc9c" },
  color6: { backgroundColor: "#3498db" },
  color7: { backgroundColor: "#34495e" },

  profileCriticalOptions: {
    gap: 12,
    marginBottom: 35,
  },
  criticalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#eee",
    gap: 15,
  },
  criticalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBg: { backgroundColor: "#ffebee" },
  deleteBg: { backgroundColor: "#f5f5f5" },
  criticalText: {
    flex: 1,
  },
  criticalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  textRed: {
    color: "#ff4d4d",
  },
  criticalDesc: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  volver: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
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
});
