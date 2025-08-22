import React from "react";
import NavBar from "./NavBar";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { xUserID } from "./LoginScreen";

export let xVGid = "";
export let xVGName = "";
export let xFullName = "";

export default function AttendanceAddMemberScreen() {
  const navigation = useNavigation();
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [tableData, setTableData] = React.useState([]);
  const API_KEY = "AIzaSyDLB1EfUATYqnSiih6rO_FM35RZ969E7wY";
  const SHEET_ID = "1BBt7DO0m5PA7EAJ8aZy9ZqldF22N975dm0Hv3KinsYA";
  const DATA_RANGE = "Data!A:D";
  const ADMIN_RANGE = "VGAdminData!A:C";

  React.useEffect(() => {
    // Fetch leader name
    const fetchName = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${DATA_RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (data && data.values && data.values.length > 0) {
          const rows = data.values;
          const found = rows.find((row) => row[0] === xUserID);
          if (found) {
            const fullName = `${found[1] || ""} ${found[3] || ""}`.trim();
            setName(fullName);
            xFullName = fullName;
          } else {
            setName("Not found");
          }
        } else {
          setName("Not found");
        }
      } catch (e) {
        setName("Error");
      } finally {
        setLoading(false);
      }
    };

    // Fetch VGAdminData table
    const fetchTable = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${ADMIN_RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (data && data.values && data.values.length > 0) {
          // Only include rows where column C matches xUserID
          const filtered = data.values.filter((row) => row[2] === xUserID);
          setTableData(filtered);
        } else {
          setTableData([]);
        }
      } catch (e) {
        setTableData([]);
      }
    };

    fetchName();
    fetchTable();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", paddingTop: 0 }}
        edges={["top"]}
      >
        {/* Header segment */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          <View
            style={[
              styles.segment,
              {
                alignItems: "center",
                justifyContent: "center",
                marginTop: 0,
              },
            ]}
          >
            <Text
              style={[
                styles.leaderId,
                {
                  flexShrink: 1,
                  flexWrap: "wrap",
                  textAlign: "left",
                  width: "100%",
                },
              ]}
              numberOfLines={0} // Allow unlimited lines for wrapping
              adjustsFontSizeToFit={false}
            >
              Leader ID: {xUserID}
            </Text>
            <Text
              style={[
                styles.nameLabel,
                {
                  flexShrink: 1,
                  flexWrap: "wrap",
                  textAlign: "left",
                  width: "100%",
                },
              ]}
              numberOfLines={0} // Allow unlimited lines for wrapping
              adjustsFontSizeToFit={false}
            >
              Name:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {loading ? (
                  <ActivityIndicator size="small" color="#4F8EF7" />
                ) : (
                  name
                )}
              </Text>
            </Text>
          </View>
        </View>
        {/* Body segment, scrollable, now right below header */}
        <ScrollView
          style={styles.bodySegment}
          contentContainerStyle={{
            alignItems: "center",
            padding: 16,
          }}
        >
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>
              Your Victory Groups
            </Text>
          </View>
          {tableData.length === 0 ? (
            <Text style={{ color: "#22336B", fontSize: 16, marginTop: 12 }}>
              No data found.
            </Text>
          ) : (
            tableData.map((row, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tableRow}
                onPress={() => {
                  xVGid = row[0] || ""; // Set VGID (column A)
                  xVGName = row[1] || ""; // Set VG Name (column B only, no VGID)
                  navigation.navigate("AttendanceHomeScreen"); // <-- navigate to AttendanceHomeScreen
                }}
              >
                <Text style={styles.tableCell}>
                  {(row[0] || "") + " " + (row[1] || "")}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: 70,
          backgroundColor: "#fff",
          padding: 0,
          margin: 0,
        }}
      >
        <NavBar navigation={navigation} />
      </View>
      <View
        style={{
          width: "100%",
          height: 45,
          backgroundColor: "#ffffff",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  segment: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#22336B",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    marginTop: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "flex-start",
  },
  bodySegment: {
    flex: 1,
    width: "100%",
    maxWidth: 400, // Optional: limit width for better centering on large screens
    backgroundColor: "#f7f7fa",
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: "center", // Center horizontally
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22336B",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: "100%",
    justifyContent: "space-between",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    color: "#22336B",
    fontSize: 24, // Increased font size for header
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: "100%",
    justifyContent: "space-between",
  },
  tableCell: {
    flex: 1,
    color: "#22336B",
    fontSize: 22, // Increased font size for bigger text in the table
    paddingHorizontal: 4,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  leaderId: {
    fontSize: 18, // Match AttendanceHomeScreen.js
    color: "#fff",
    marginBottom: 4,
    fontWeight: "bold",
  },
  nameLabel: {
    fontSize: 16, // Match AttendanceHomeScreen.js
    color: "#fff",
    marginBottom: 12,
    fontWeight: "bold",
  },
});
