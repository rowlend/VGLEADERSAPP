import React from "react";
import NavBar from "./NavBar";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { xUserID } from "./LoginScreen";

export default function AttendanceAddMemberScreen() {
  const navigation = useNavigation();
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
          // Do NOT skip row 1, treat all rows as data
          const found = rows.find((row) => row[0] === xUserID);
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
  }, []);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", paddingTop: 0 }}
        edges={["top"]}
      >
        <View
          style={{
            flex: 2,
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
              Leader ID: {xUserID}
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
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 0,
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
});
