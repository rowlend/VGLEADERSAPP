import React from "react";
import NavBar from "./NavBar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { xUserID } from "./LoginScreen";
import { xFullName, xVGName, xVGid } from "./SelectVGAttendanceScreen";
import { API_KEY, SHEET_ID } from "./config";

export default function AttendanceSubmitScreen() {
  const navigation = useNavigation();
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTable = async () => {
      try {
        const RANGE = "Data!A:AX"; // AX is now column 50 (index 49)
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const text = await response.text();
        console.log("Raw Google Sheets API response:", text); // <-- log raw response
        if (!response.ok) throw new Error("Failed to fetch");
        const data = JSON.parse(text);
        if (data && data.values && data.values.length > 0) {
          // Filter rows where column AX (index 49) matches xVGid
          const filtered = data.values.filter((row) => row[48] === xVGid);
          console.log("Filtered rows:", filtered); // <-- log filtered rows
          setTableData(filtered);
        } else {
          setTableData([]);
          console.log("No data.values or empty array");
        }
      } catch (e) {
        setTableData([]);
        console.log("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", paddingTop: 0 }}
        edges={["top"]}
      >
        {/* Header Segment */}
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
                  fontSize: 16,
                  textAlign: "left",
                  width: "100%",
                  lineHeight: 20,
                  marginBottom: 0,
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit={false}
            >
              Leader ID: {xUserID}
            </Text>
            <Text
              style={[
                styles.leaderId,
                {
                  fontSize: 16,
                  textAlign: "left",
                  width: "100%",
                  lineHeight: 20,
                  marginBottom: 0,
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit={false}
            >
              Name: <Text style={{ fontWeight: "bold" }}>{xFullName}</Text>
            </Text>
            <Text
              style={[
                styles.leaderId,
                {
                  fontSize: 16,
                  textAlign: "left",
                  width: "100%",
                  lineHeight: 20,
                  marginBottom: 0,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit={false}
            >
              Victory Group #:{" "}
              <Text style={{ fontWeight: "bold" }}>{xVGid}</Text>
            </Text>
            <Text
              style={[
                styles.leaderId,
                {
                  fontSize: 16,
                  textAlign: "left",
                  width: "100%",
                  lineHeight: 20,
                  marginBottom: 0,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit={false}
            >
              Victory Group:{" "}
              <Text style={{ fontWeight: "bold" }}>{xVGName}</Text>
            </Text>
          </View>
        </View>
        {/* Body section in a ScrollView, now flex: 1 for independent scrolling */}
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView
            style={styles.bodySection}
            contentContainerStyle={{ alignItems: "center", padding: 16 }}
          >
            <View style={styles.tableHeader}>
              <Text style={[styles.checkboxCell, styles.tableHeaderCell]}>
                &#x2610; {/* Unicode for an empty checkbox */}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                ID #
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                First Name
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                Last Name
              </Text>
            </View>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#22336B"
                style={{ marginTop: 20 }}
              />
            ) : tableData.length === 0 ? (
              <Text style={{ color: "#22336B", fontSize: 16, marginTop: 12 }}>
                No data found.
              </Text>
            ) : (
              tableData.map((row, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.checkboxCell}></Text>{" "}
                  {/* Checkbox placeholder */}
                  <Text style={styles.tableCell}>{row[0]}</Text>{" "}
                  {/* ID # (Column A) */}
                  <Text style={styles.tableCell}>{row[1]}</Text>{" "}
                  {/* First Name (Column B) */}
                  <Text style={styles.tableCell}>{row[3]}</Text>{" "}
                  {/* Last Name (Column D) */}
                </View>
              ))
            )}
          </ScrollView>
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
  bodySection: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f7f7fa",
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: "center",
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
    fontSize: 18,
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
    fontSize: 16,
    paddingHorizontal: 4,
  },
  checkboxCell: {
    width: 32, // just enough for a checkbox
    textAlign: "center",
    color: "#22336B",
    fontSize: 18,
    paddingHorizontal: 0,
    flex: 0,
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
