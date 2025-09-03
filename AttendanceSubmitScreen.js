import React, { useState } from "react";
import NavBar from "./NavBar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { xUserID } from "./LoginScreen";
import { xFullName, xVGName, xVGid } from "./SelectVGAttendanceScreen";
import { API_KEY, SHEET_ID } from "./config";
import DateTimePicker from "@react-native-community/datetimepicker";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyLb35nlolWLPVkD3JXkJWAvH_z0insx-PovEwEL5yyP6RLe13UDFGkZeWSlCdmzSMQ/exec";
const GOOGLE_APPS_SCRIPT_REMARKS_URL =
  "https://script.google.com/macros/s/AKfycbxexjddlglhI5fTkdvjTQi-1KVK-5ZeiX6OEvdQjCv_d1-riom95u78i80fRoN2N7qF/exec";

const generateRecordID = () => {
  return "CPAPPREC" + new Date().getTime().toString();
};

// Add this helper function above your component:
function formatDateMMDDYYYY(dateObj) {
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function AttendanceSubmitScreen() {
  const navigation = useNavigation();
  const [tableData, setTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [checkedRows, setCheckedRows] = React.useState({}); // Track checked state by row index
  const [headerChecked, setHeaderChecked] = React.useState(false); // Add a state for header checkbox
  const [date, setDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");
  const [threeDigit, setThreeDigit] = useState("");

  React.useEffect(() => {
    const fetchTable = async () => {
      try {
        const RANGE = "Data!A:AX"; // AX is now column 50 (index 49)
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const text = await response.text();
        console.log("Raw Google Sheets API response:", text);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = JSON.parse(text);
        if (data && data.values && data.values.length > 0) {
          // Filter rows where column AX (index 49) matches xVGid
          const filtered = data.values.filter((row) => row[48] === xVGid);
          console.log("Filtered rows:", filtered);
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

  // Handler to toggle checkbox
  const toggleCheckbox = (idx) => {
    setCheckedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Handler to toggle all checkboxes
  const toggleAllCheckboxes = () => {
    if (tableData.length === 0) return;
    const newChecked = {};
    if (!headerChecked) {
      tableData.forEach((_, idx) => {
        newChecked[idx] = true;
      });
    }
    setCheckedRows(newChecked);
    setHeaderChecked(!headerChecked);
  };

  // When tableData changes, reset headerChecked and checkedRows
  React.useEffect(() => {
    setCheckedRows({});
    setHeaderChecked(false);
  }, [tableData]);

  // Replace attendanceDate, checkedMembers, members, selectedVG, comments with your actual state/props
  // For this example, we'll use:
  const attendanceDate = formatDateMMDDYYYY(date);
  const checkedMembers = checkedRows;
  const members = tableData.map((row, idx) => ({
    id: idx,
    columnA: row[0], // ID #
    columnB: row[1], // First Name
    columnD: row[3], // Last Name
  }));
  const selectedVG = { name: xVGid, description: xVGName };

  const handleSubmitAttendance = async () => {
    if (isSubmitting) {
      Alert.alert(
        "Please wait",
        "Your attendance is already being submitted..."
      );
      return;
    }

    if (!attendanceDate) {
      Alert.alert("Error", "Please select an attendance date");
      return;
    }

    const checkedMemberIds = Object.keys(checkedRows).filter(
      (id) => checkedRows[id]
    );

    if (checkedMemberIds.length === 0) {
      Alert.alert("Error", "Please select at least one member for attendance");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Fetch existing attendance records
      const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/VGAttendance!A:F?key=${API_KEY}`;
      const checkResponse = await fetch(checkUrl, {
        headers: { Accept: "application/json" },
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();

        if (checkData.values && checkData.values.length > 1) {
          // Skip header row
          const submittingMemberIds = checkedMemberIds
            .map((memberId) => {
              const member = members.find((m) => m.id.toString() === memberId);
              return member ? member.columnA : null;
            })
            .filter((id) => id !== null);

          // 2. Check for duplicate records by VG Group, Member ID, and Date
          const duplicateMembers = [];
          for (const memberID of submittingMemberIds) {
            const existingRecord = checkData.values.find(
              (row) =>
                row[1] &&
                row[2] &&
                row[3] &&
                row[1].toString().trim() === (selectedVG?.name || "").trim() &&
                row[2].toString().trim() === memberID.trim() &&
                row[3].toString().trim() === attendanceDate.trim()
            );
            if (existingRecord) {
              const memberInfo = members.find((m) => m.columnA === memberID);
              const memberName = memberInfo
                ? `${memberInfo.columnB} ${memberInfo.columnD}`.trim()
                : memberID;
              duplicateMembers.push(memberName);
            }
          }

          if (duplicateMembers.length > 0) {
            const memberList = duplicateMembers.join(", ");
            Alert.alert(
              "Duplicate Record Found",
              `The following member(s) already have attendance records for "${selectedVG?.name}" on ${attendanceDate}:\n\n${memberList}\n\nPlease choose a different date or remove these members from the selection.`,
              [{ text: "OK" }]
            );
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Prepare attendance records
      const attendanceRecords = checkedMemberIds
        .map((memberId) => {
          const member = members.find((m) => m.id.toString() === memberId);
          return member ? member.columnA : null;
        })
        .filter((id) => id !== null);

      const recordID = generateRecordID();
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const year = now.getFullYear();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const timestamp = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

      const records = attendanceRecords.map((memberID) => ({
        recordID,
        vgGroupID: selectedVG?.name || "",
        memberID,
        date: attendanceDate,
        timestamp,
      }));

      // Send to Google Apps Script
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: records,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          // After successful VGAttendance submission, submit to VGAttendanceRemarks
          // Prepare data for VGAttendanceRemarks
          const remarksPayload = {
            recordID,
            selectedVG: selectedVG?.name || "",
            comments: comments.trim(),
            attendanceDate,
            countChecked: countChecked ? threeDigit || "0" : "0",
            formatDateMMDDYYYY: `${formatDateMMDDYYYY(now)} ${now
              .getHours()
              .toString()
              .padStart(2, "0")}:${now
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${now
              .getSeconds()
              .toString()
              .padStart(2, "0")}`, // <-- now includes time
          };

          try {
            const remarksResponse = await fetch(
              GOOGLE_APPS_SCRIPT_REMARKS_URL,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(remarksPayload),
              }
            );

            if (!remarksResponse.ok) {
              Alert.alert(
                "Warning",
                "Attendance was submitted, but remarks could not be saved."
              );
            }
          } catch (err) {
            Alert.alert(
              "Warning",
              "Attendance was submitted, but remarks could not be saved (network error)."
            );
          }

          Alert.alert(
            "Success",
            `Attendance submitted successfully!\n${attendanceRecords.length} members recorded.`,
            [
              {
                text: "OK",
                onPress: () => {
                  setCheckedRows({});
                  // Optionally reset other states here
                },
              },
            ]
          );
        } else {
          Alert.alert(
            "Error",
            `Failed to submit attendance: ${
              responseData.error || "Unknown error"
            }`
          );
        }
      } else {
        const errorText = await response.text();
        Alert.alert(
          "Error",
          `Failed to submit attendance. Status: ${response.status}`
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit attendance. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [countChecked, setCountChecked] = useState(false);

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
        {/* Date Picker above the table */}
        <View
          style={{
            width: "100%",
            alignItems: "flex-start",
            marginTop: 8,
            flexDirection: "row",
            paddingLeft: 24,
          }}
        >
          <Text
            style={{
              color: "#22336B",
              fontSize: 16,
              fontWeight: "bold",
              marginRight: 12,
              alignSelf: "center",
            }}
          >
            Attendance Date:
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#e0e7ff",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginBottom: 8,
              alignSelf: "center",
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: "#22336B", fontSize: 16 }}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>
        {/* Body section in a ScrollView, now flex: 1 for independent scrolling */}
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView
            style={styles.bodySection}
            contentContainerStyle={{ alignItems: "center", padding: 16 }}
          >
            <View style={styles.tableHeader}>
              <TouchableOpacity
                onPress={toggleAllCheckboxes}
                style={{ width: 32, alignItems: "center" }}
              >
                <Text style={styles.checkboxCell}>
                  {headerChecked ? "\u2611" : "\u2610"}
                </Text>
              </TouchableOpacity>
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
                <TouchableOpacity
                  key={idx}
                  style={styles.tableRow}
                  onPress={() => toggleCheckbox(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.checkboxCell}>
                    {checkedRows[idx] ? "\u2611" : "\u2610"}
                  </Text>
                  <Text style={styles.tableCell}>{row[0]}</Text>
                  <Text style={styles.tableCell}>{row[1]}</Text>
                  <Text style={styles.tableCell}>{row[3]}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          {/* Comments section is now above the submit button */}
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
              paddingHorizontal: 24,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "#22336B",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginRight: 8,
                }}
              >
                Comments:
              </Text>
              <View style={{ flex: 1 }} />
              {/* Label for the checkbox */}
              <Text style={{ color: "#22336B", fontSize: 16, marginRight: 4 }}>
                Count:
              </Text>
              <TouchableOpacity
                onPress={() => setCountChecked((prev) => !prev)}
                style={{
                  marginRight: 8,
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 22, color: "#22336B" }}>
                  {countChecked ? "\u2611" : "\u2610"}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={{
                  width: 48,
                  height: 36,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 16,
                  backgroundColor: countChecked ? "#fff" : "#eee", // visually indicate disabled
                  marginLeft: 4,
                  textAlign: "center",
                }}
                placeholder="000"
                placeholderTextColor="#aaa"
                value={threeDigit}
                onChangeText={(text) => {
                  // Only allow up to 3 digits, numbers only
                  if (/^\d{0,3}$/.test(text)) setThreeDigit(text);
                }}
                keyboardType="numeric"
                maxLength={3}
                editable={countChecked} // <-- disables input when unchecked
              />
            </View>
            <TextInput
              style={{
                width: "100%",
                minHeight: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                fontSize: 16,
                backgroundColor: "#fff",
                marginBottom: 4,
              }}
              placeholder="Enter comments here..."
              placeholderTextColor="#aaa"
              value={comments}
              onChangeText={setComments}
              multiline
            />
          </View>
          {/* Submit button is now below the comments section */}
          <View style={{ width: "100%", alignItems: "center", marginTop: 8 }}>
            {isSubmitting ? (
              <View
                style={{
                  backgroundColor: "#4CAF50",
                  borderRadius: 8,
                  paddingVertical: 12,
                  width: "92%",
                  alignItems: "center",
                  marginBottom: 16,
                  maxWidth: 340,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="small" color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginLeft: 12,
                  }}
                >
                  Submitting...
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  borderRadius: 8,
                  paddingVertical: 12,
                  width: "92%",
                  alignItems: "center",
                  marginBottom: 16,
                  maxWidth: 340,
                }}
                onPress={handleSubmitAttendance}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            )}
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
