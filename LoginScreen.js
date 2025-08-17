import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(null); // null = unknown, true = connected, false = not connected
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

  const navigation = require("@react-navigation/native").useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
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
            // Fetch user data from Google Sheet and check credentials
            try {
              const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/VGLeadersApp!A:B?key=${API_KEY}`;
              const response = await fetch(url);
              if (!response.ok) throw new Error("Failed to fetch");
              const data = await response.json();
              if (data && data.values && data.values.length > 0) {
                // Skip header if present, start from row 1 if row 0 is header
                const rows = data.values;
                // Try to detect if first row is header
                const hasHeader =
                  rows[0][0].toLowerCase().includes("username") ||
                  rows[0][1].toLowerCase().includes("password");
                const userRows = hasHeader ? rows.slice(1) : rows;
                const found = userRows.some(
                  (row) => row[0] === username && row[1] === password
                );
                if (found) {
                  console.log(
                    "Login successful, navigating to AttendanceHomeScreen"
                  );
                  navigation.navigate("AttendanceHome", { userId: username });
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
          <ActivityIndicator size="small" color="#4F8EF7" />
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
  checkboxRow: {
    width: "100%",
    maxWidth: 320,
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
    borderColor: "#888",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxBoxChecked: {
    backgroundColor: "#4F8EF7",
    borderColor: "#4F8EF7",
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#333",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  statusLight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  segment: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#4F8EF7",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    maxWidth: 320,
    height: 48,
    backgroundColor: "#4F8EF7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
