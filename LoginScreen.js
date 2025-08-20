import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export let xUserID = ""; // <-- Added universal variable

export default function LoginScreen() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(null);
  const [checking, setChecking] = React.useState(false);

  // Google Sheets API details
  const API_KEY = "AIzaSyDLB1EfUATYqnSiih6rO_FM35RZ969E7wY";
  const SHEET_ID = "1BBt7DO0m5PA7EAJ8aZy9ZqldF22N975dm0Hv3KinsYA";
  const RANGE = "VGLeadersApp!A1:A1";

  React.useEffect(() => {
    const testConnection = async () => {
      setChecking(true);
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (response.ok) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (e) {
        setIsConnected(false);
      } finally {
        setChecking(false);
      }
    };
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("./assets/VictoryLogo_Blue.png")} // <-- Updated filename
          style={styles.logo}
        />
        <Text style={styles.headerText}>Victory</Text>
      </View>
      <View style={styles.segment}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setShowPassword(!showPassword)}
          >
            <View
              style={[
                styles.checkboxBox,
                showPassword && styles.checkboxBoxChecked,
              ]}
            >
              {showPassword && <View style={styles.checkboxTick} />}
            </View>
            <Text style={styles.checkboxLabel}>Show Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/VGLeadersApp!A:B?key=${API_KEY}`;
              const response = await fetch(url);
              if (!response.ok) throw new Error("Failed to fetch");
              const data = await response.json();
              if (data && data.values && data.values.length > 0) {
                const rows = data.values;
                const hasHeader =
                  rows[0][0].toLowerCase().includes("username") ||
                  rows[0][1].toLowerCase().includes("password");
                const userRows = hasHeader ? rows.slice(1) : rows;
                const found = userRows.some(
                  (row) => row[0] === username && row[1] === password
                );
                if (found) {
                  xUserID = username; // <-- Set the universal variable
                  navigation.navigate("AttendanceHomeScreen", {
                    userId: username,
                  });
                } else {
                  Alert.alert("Invalid username or password");
                }
              } else {
                Alert.alert("No user data found");
              }
            } catch (e) {
              Alert.alert("Error connecting to sheet");
            }
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>Status: </Text>
        {checking ? (
          <ActivityIndicator size="small" color="#22336B" />
        ) : (
          <View
            style={[
              styles.statusLight,
              {
                backgroundColor:
                  isConnected === null
                    ? "#ccc"
                    : isConnected
                    ? "#4CAF50"
                    : "#F44336",
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    width: "100%",
    backgroundColor: "#fffff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 0, // Changed from 24 to 0 to remove extra space below logo
    marginBottom: 0, // Changed from 12 to 0 to remove margin below header
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 0, // Ensure no margin below logo
    padding: 0,
    resizeMode: "contain",
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  segment: {
    width: "90%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
    alignItems: "center",
    marginTop: 0, // Ensure no margin above segment
    minHeight: 260, // Add this line to make the segment higher
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#22336B",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#22336B",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#22336B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  checkboxRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#22336B",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxBoxChecked: {
    backgroundColor: "#22336B",
    borderColor: "#22336B",
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#22336B",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  statusText: {
    fontSize: 16,
    color: "#22336B",
    marginRight: 8,
  },
  statusLight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
