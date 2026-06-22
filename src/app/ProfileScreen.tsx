import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabaseClient } from "../supabaseClient";

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState({
    nombre: "Nombre de Usuario",
    email: "nombre@garagego.com",
    saldo: "0.00",
    vehiculosContador: 2, // Siguiendo tus "2 vehículos" de muestra
  });

  // Cargar metadatos reales del usuario desde Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (user) {
        const { data } = await supabaseClient
          .from("usuario")
          .select("nombre, apellido, email")
          .eq("email", user.email)
          .maybeSingle();

        if (data) {
          setUserData((prev) => ({
            ...prev,
            nombre: `${data.nombre} ${data.apellido || ""}`,
            email: data.email,
          }));
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CABECERA AMARILLA DE PERFIL */}
        <View style={styles.profileHeaderCard}>
          {/* Botón Volver */}
          <TouchableOpacity
            style={styles.backBtnProfile}
            onPress={() => {
              // navigation.goBack(); // Descomenta al activar la navegación
              Alert.alert("Volver", "Regresar a la pantalla principal");
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Botones Flotantes de la Derecha (Editar y Configuración) */}
          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.headerActionBtn}>
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() =>
                Alert.alert("Configuración", "Abriendo ajustes...")
              }
            >
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Información Principal */}
          <View style={styles.profileMainData}>
            <View style={styles.profileAvatarSlot}>
              <FontAwesome name="user-circle" size={80} color="#fff" />
              <TouchableOpacity style={styles.editPhotoBtn}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileTextInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {userData.nombre}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {userData.email}
              </Text>
              <View style={styles.vehiclesPill}>
                <Ionicons name="car" size={14} color="#f5b800" />
                <Text style={styles.vehiclesPillText}>
                  {" "}
                  {userData.vehiculosContador} vehículos
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CONTENIDO DE PERFIL */}
        <View style={styles.profileContent}>
          {/* TARJETA DE SALDO CORPORATIVA */}
          <View style={styles.balanceCardProfile}>
            <View style={styles.walletIconBox}>
              <Ionicons name="wallet" size={20} color="#f5b800" />
              <Text style={styles.balanceLabel}>Tu Saldo</Text>
            </View>
            <Text style={styles.balanceValue}>$ {userData.saldo}</Text>
          </View>

          {/* SECCIÓN CUENTA */}
          <View style={styles.profileSection}>
            <Text style={styles.sectionHeading}>CUENTA</Text>

            {/* CUADRÍCULA EN DOS COLUMNAS (GRID MIGRADO) */}
            <View style={styles.gridOptions}>
              {/* Item: Datos Personales */}
              <TouchableOpacity
                style={styles.gridItem}
                onPress={() =>
                  Alert.alert("Navegación", "Ir a Datos Personales")
                }
              >
                <View style={[styles.gridIcon, styles.color1]}>
                  <Ionicons name="briefcase" size={22} color="#fff" />
                </View>
                <Text style={styles.gridLabel}>Datos Personales</Text>
              </TouchableOpacity>

              {/* Item: Mis Vehículos */}
              <TouchableOpacity
                style={styles.gridItem}
                onPress={() => Alert.alert("Navegación", "Ir a Mis Vehículos")}
              >
                <View style={[styles.gridIcon, styles.color2]}>
                  <Ionicons name="car" size={24} color="#fff" />
                </View>
                <Text style={styles.gridLabel}>Mis Vehículos</Text>
              </TouchableOpacity>

              {/* Item: Métodos de Pago */}
              <TouchableOpacity
                style={styles.gridItem}
                onPress={() =>
                  Alert.alert("Navegación", "Ir a Métodos de Pago")
                }
              >
                <View style={[styles.gridIcon, styles.color3]}>
                  <Ionicons name="card" size={22} color="#fff" />
                </View>
                <Text style={styles.gridLabel}>Métodos de Pago</Text>
              </TouchableOpacity>

              {/* Item: Facturación */}
              <TouchableOpacity
                style={styles.gridItem}
                onPress={() => Alert.alert("Navegación", "Ir a Facturación")}
              >
                <View style={[styles.gridIcon, styles.color4]}>
                  <Ionicons name="receipt" size={22} color="#fff" />
                </View>
                <Text style={styles.gridLabel}>Facturación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  profileHeaderCard: {
    backgroundColor: "#f5b800",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 45 : 20,
    paddingBottom: 35,
    position: "relative",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  backBtnProfile: {
    position: "absolute",
    top: Platform.OS === "android" ? 45 : 20,
    left: 15,
    padding: 5,
    zIndex: 10,
  },
  topRightActions: {
    position: "absolute",
    top: Platform.OS === "android" ? 45 : 20,
    right: 15,
    flexDirection: "row",
    gap: 12,
    zIndex: 10,
  },
  headerActionBtn: {
    padding: 5,
  },
  profileMainData: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    gap: 20,
  },
  profileAvatarSlot: {
    position: "relative",
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#333",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f5b800",
  },
  profileTextInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 8,
  },
  vehiclesPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  vehiclesPillText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  profileContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  balanceCardProfile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  walletIconBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileSection: {
    marginBottom: 20,
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  gridItem: {
    backgroundColor: "#f9f9f9",
    width: "47%", // Mantiene una distribución equilibrada de dos columnas simétricas
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#eee",
  },
  gridIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  /* Colores de las cajas de iconos simulando tu CSS anterior */
  color1: { backgroundColor: "#4a90e2" },
  color2: { backgroundColor: "#2ecc71" },
  color3: { backgroundColor: "#9b59b6" },
  color4: { backgroundColor: "#e67e22" },
});
