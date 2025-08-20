import React from "react";
import NavBar from "./NavBar";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AttendanceHomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId || "";
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const API_KEY = "AIzaSyDLB1EfUATYqnSiih6rO_FM35RZ969E7wY";
  const SHEET_ID = "1BBt7DO0m5PA7EAJ8aZy9ZqldF22N975dm0Hv3KinsYA";
  const RANGE = "Data!A:D";

  React.useEffect(() => {
    const fetchName = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (data && data.values && data.values.length > 0) {
          const rows = data.values;
          // Try to detect if first row is header
          const hasHeader =
            rows[0][0].toLowerCase().includes("leader") ||
            rows[0][1].toLowerCase().includes("first");
          const userRows = hasHeader ? rows.slice(1) : rows;
          const found = userRows.find((row) => row[0] === userId);
          if (found) {
            // Column B + ' ' + Column D
            const fullName = `${found[1] || ""} ${found[3] || ""}`.trim();
            setName(fullName);
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
    fetchName();
  }, [userId]);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", paddingTop: 0 }}
        edges={["top"]}
      >
        {/* Add marginTop to move the body higher */}
        <View
          style={{
            flex: 2, // 30% of available space
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100%",
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
            {/* Removed the Welcome text */}
            <Text
              style={[
                styles.leaderId,
                {
                  flexShrink: 2,
                  flexWrap: "wrap",
                  textAlign: "left",
                  width: "100%",
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Leader ID: {userId}
            </Text>
            <Text
              style={[
                styles.nameLabel,
                {
                  flexShrink: 2,
                  flexWrap: "wrap",
                  textAlign: "left",
                  width: "100%",
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
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
        {/* Segment 2: Main buttons */}
        {/* Removed the entire main buttons segment */}
      </SafeAreaView>
      {/* NavBar is now directly above the footer */}
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
      {/* Footer with height 10px */}
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
    backgroundColor: "#22336B", // dark blue from blue palette
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    marginTop: 13, // reduced from 16 to 13 to decrease gray space by 3px
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "flex-start",
  },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginTop: 3,
    marginBottom: 12,
  },
  leaderId: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 4,
    fontWeight: "bold",
  },
  nameLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F8EF7",
  },
  tableCol: {
    flexDirection: "column",
    width: Dimensions.get("window").width,
    alignSelf: "center",
    marginTop: 12, // was 24
    marginBottom: 12, // was 24
  },
  tableCell: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 140,
  },
  tableCellText: {
    color: "#22336B",
    fontWeight: "bold",
    fontSize: 18,
  },
  tableImage: {
    width: "100%",
    height: "100%",
  },
  tableScrollView: {
    flex: 1,
    width: "100%",
  },
  submitButtonCell: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 140,
  },
  submitButton: {
    width: 340,
    backgroundColor: "#22336B",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  submitImage: {
    width: "100%",
    height: "100%",
  },
});
