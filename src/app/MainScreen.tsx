import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Librería oficial de mapas (Si no la tienes, ejecuta: npx expo install react-native-maps)
import MapView, { Marker } from "react-native-maps";
// Iconos oficiales integrados de Expo
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { supabaseClient } from "../supabaseClient";

const { width, height } = Dimensions.get("window");

export default function MainScreen({ navigation }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHostMode, setIsHostMode] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "Nombre de Usuario",
    saldo: "0.00",
  });

  // Región inicial por defecto del mapa (CABA, Buenos Aires como referencia de tu HTML)
  const [region, setRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  // Simulación de protección de página principal / Cargar metadatos de Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) {
        Alert.alert("Acceso denegado", "Debes iniciar sesión primero.");
        // navigation.navigate('Login');
        return;
      }

      // Obtener el nombre y saldo de la tabla 'usuario'
      const { data, error } = await supabaseClient
        .from("usuario")
        .select("nombre, apellido") // Añade el saldo si cuentas con esa columna
        .eq("email", user.email)
        .maybeSingle();

      if (data) {
        setUserData({
          nombre: `${data.nombre} ${data.apellido || ""}`,
          saldo: "0.00", // Cambiar por la lógica real de tu base de datos
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    Alert.alert("Sesión cerrada", "Has salido de la aplicación.");
    // navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER PRINCIPAL */}
      <View style={styles.mainHeader}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setIsMenuOpen(true)}
        >
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icons/logo.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* BARRA DE BÚSQUEDA */}
      <View style={styles.searchArea}>
        <View style={styles.searchInputGroup}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchLeftIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#888"
          />
          <Ionicons name="mic" size={20} color="#888" style={styles.micIcon} />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* VISTA DEL MAPA NATIVO */}
      <View style={styles.mapViewport}>
        <MapView style={styles.map} initialRegion={region}>
          {/* Marcador de ejemplo para el garage de la tarjeta flotante */}
          <Marker
            coordinate={{ latitude: -34.6037, longitude: -58.3816 }}
            title="Garage Disponible"
            description="Calle 123, CABA"
          />
        </MapView>
      </View>

      {/* CARD DE DETALLE DE GARAGE (FLOTANTE) */}
      <View style={styles.garageFloatingCard}>
        <View style={styles.garageCardContent}>
          <View style={styles.garageImgContainer}>
            <Image
              source={require("../../assets/images/icons/garage1.jpg")}
              style={styles.garageThumb}
            />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>
                $450<Text style={styles.priceSubText}>/hs</Text>
              </Text>
            </View>
          </View>

          <View style={styles.garageInfo}>
            <View style={styles.garageMainRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#f5b800" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
            <Text style={styles.garageAddress}>
              <Ionicons name="location" size={14} color="#555" /> Calle 123,
              CABA
            </Text>

            <View style={styles.garageTags}>
              <View style={styles.tag}>
                <Ionicons name="shield-checkmark" size={12} color="#f5b800" />
                <Text style={styles.tagText}> Seguridad</Text>
              </View>
              <View style={styles.tag}>
                <Ionicons name="time" size={12} color="#f5b800" />
                <Text style={styles.tagText}> 24h</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnReserve}
              onPress={() => Alert.alert("Reserva", "Procesando reserva...")}
            >
              <Text style={styles.btnReserveText}>Reservar ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MENÚ LATERAL (SIDE MENU FLOTANTE) */}
      {isMenuOpen && (
        <View style={styles.sideMenuContainer}>
          {/* Fondo traslúcido oscuro para cerrar el menú */}
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={() => setIsMenuOpen(false)}
          />

          {/* Contenido del menú desplegable */}
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeaderCard}>
              <View style={styles.profileContainer}>
                <FontAwesome name="user-circle" size={60} color="#ccc" />
                <View style={styles.statusIndicator} />
              </View>
              <Text style={styles.userFullName}>{userData.nombre}</Text>

              <View style={styles.balanceContainer}>
                <Ionicons name="wallet-outline" size={18} color="#f5b800" />
                <Text style={styles.balanceText}>
                  Saldo GarageGo: ${userData.saldo}
                </Text>
              </View>

              {/* Card de Modo Anfitrión */}
              <View style={styles.hostModeCard}>
                <View style={styles.hostInfo}>
                  <View style={styles.hostIcon}>
                    <Ionicons name="home-outline" size={18} color="#fff" />
                  </View>
                  <Text style={styles.modeTitle}>Modo anfitrión</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#f5b800" }}
                  thumbColor={isHostMode ? "#fff" : "#f4f3f4"}
                  onValueChange={setIsHostMode}
                  value={isHostMode}
                />
              </View>
            </View>

            {/* ÍTEMS DE NAVEGACIÓN */}
            <ScrollView style={styles.sideNav}>
              <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                <View style={styles.navIconBox}>
                  <Ionicons name="home" size={18} color="#f5b800" />
                </View>
                <Text style={[styles.navText, styles.navTextActive]}>
                  Inicio
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#f5b800" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                  setIsMenuOpen(false); /* navigation.navigate('Perfil') */
                }}
              >
                <View style={styles.navIconBox}>
                  <Ionicons name="person-outline" size={18} color="#555" />
                </View>
                <Text style={styles.navText}>Mi Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                  setIsMenuOpen(false);
                }}
              >
                <View style={styles.navIconBox}>
                  <Ionicons name="calendar-outline" size={18} color="#555" />
                </View>
                <Text style={styles.navText}>Reservas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                  setIsMenuOpen(false);
                }}
              >
                <View style={styles.navIconBox}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#555"
                  />
                </View>
                <Text style={styles.navText}>Mensajes</Text>
              </TouchableOpacity>

              <View style={styles.navDivider} />

              <TouchableOpacity
                style={[styles.navItem, styles.logout]}
                onPress={handleLogout}
              >
                <View style={styles.navIconBox}>
                  <Ionicons name="log-out-outline" size={18} color="#ff4d4d" />
                </View>
                <Text style={[styles.navText, { color: "#ff4d4d" }]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  mainHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconBtn: {
    padding: 5,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  brandLogo: {
    width: 120,
    height: 40,
  },
  headerSpacer: {
    width: 40,
  },
  searchArea: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
  },
  searchInputGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 45,
  },
  searchLeftIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },
  micIcon: {
    marginLeft: 8,
  },
  filterBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#f5b800",
    alignItems: "center",
    justifyContent: "center",
  },
  mapViewport: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  garageFloatingCard: {
    position: "absolute",
    bottom: 20,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: "hidden",
  },
  garageCardContent: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  garageImgContainer: {
    width: 110,
    height: 110,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  garageThumb: {
    width: "100%",
    height: "100%",
    backgroundColor: "#eee",
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceSubText: {
    fontSize: 9,
    fontWeight: "normal",
  },
  garageInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  garageMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  garageAddress: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  garageTags: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#ffe082",
  },
  tagText: {
    fontSize: 11,
    color: "#f5b800",
    fontWeight: "600",
  },
  btnReserve: {
    backgroundColor: "#f5b800",
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
  },
  btnReserveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  sideMenuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    flexDirection: "row",
    zIndex: 999,
  },
  menuOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuDrawer: {
    width: width * 0.75,
    maxWidth: 300,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  menuHeaderCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  profileContainer: {
    position: "relative",
    marginBottom: 10,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4cd964",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userFullName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff8e1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  balanceText: {
    fontSize: 13,
    color: "#f5b800",
    fontWeight: "600",
  },
  hostModeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 15,
    width: "100%",
  },
  hostInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hostIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5b800",
    alignItems: "center",
    justifyContent: "center",
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  sideNav: {
    flex: 1,
    padding: 15,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 15,
    marginBottom: 5,
  },
  navItemActive: {
    backgroundColor: "#fff8e1",
  },
  navIconBox: {
    width: 30,
    alignItems: "center",
    marginRight: 10,
  },
  navText: {
    flex: 1,
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },
  navTextActive: {
    color: "#f5b800",
    fontWeight: "bold",
  },
  navDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  logout: {
    marginTop: 10,
  },
});
