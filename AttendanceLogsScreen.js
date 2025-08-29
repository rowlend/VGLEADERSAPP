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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { xUserID } from "./LoginScreen";
import { xFullName, xVGName, xVGid } from "./SelectVGAttendanceScreen";
import { API_KEY, SHEET_ID } from "./config";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyLb35nlolWLPVkD3JXkJWAvH_z0insx-PovEwEL5yyP6RLe13UDFGkZeWSlCdmzSMQ/exec";

const generateRecordID = () => {
  return "CPAPPREC" + new Date().getTime().toString();
};

// Add this helper function above your component:
function parseDateString(dateStr) {
  // Handles MM/DD/YYYY or M/D/YYYY
  if (!dateStr || dateStr === "-") return new Date(0); // Treat missing as oldest
  const [month, day, year] = dateStr.split("/");
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
}

// Highlight only the row if the date is in the current week

// Helper to check if a date is in the current week
function isDateInCurrentWeek(dateObj) {
  const now = new Date();
  // Set to start of today
  now.setHours(0, 0, 0, 0);
  // Get the first day (Sunday) of this week
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - now.getDay());
  // Get the last day (Saturday) of this week
  const lastDayOfWeek = new Date(now);
  lastDayOfWeek.setDate(now.getDate() + (6 - now.getDay()));
  // Set both to start of day
  firstDayOfWeek.setHours(0, 0, 0, 0);
  lastDayOfWeek.setHours(23, 59, 59, 999);
  return dateObj >= firstDayOfWeek && dateObj <= lastDayOfWeek;
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
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  React.useEffect(() => {
    console.log("xVGid on load:", xVGid); // Log the value of xVGid on load

    const fetchTable = async () => {
      try {
        const RANGE = "VGAttendance!A:AX"; // Search in VGAttendance sheet
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const text = await response.text();
        console.log("Raw Google Sheets API response:", text);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = JSON.parse(text);
        if (data && data.values && data.values.length > 0) {
          // Log all rows and set tableData directly
          console.log("All rows:", data.values);
          setTableData(data.values);
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
  const attendanceDate = date.toLocaleDateString();
  const checkedMembers = checkedRows;
  const members = tableData.map((row, idx) => ({
    id: idx,
    columnA: row[0], // ID #
    columnB: row[1], // First Name
    columnD: row[3], // Last Name
  }));
  const selectedVG = { name: xVGid, description: xVGName };
  const comments = ""; // Add a comments state if you want

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

      const commentsRecord = comments.trim()
        ? {
            recordID,
            vgGroupID: selectedVG?.name || "",
            comments: comments.trim(),
            date: attendanceDate,
            timestamp,
          }
        : null;

      // Send to Google Apps Script
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: records,
          commentsRecord: commentsRecord,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
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

  // Add this function to toggle sort order:
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Highlight the row if the date is in the current month

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

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
            <View style={[styles.tableHeader, { width: "100%" }]}>
              <TouchableOpacity
                onPress={toggleSortOrder}
                style={{ minWidth: 110, maxWidth: 140 }}
              >
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeaderCell,
                    { minWidth: 110, maxWidth: 140, textAlign: "left" },
                  ]}
                >
                  Dates {sortOrder === "desc" ? "▼" : "▲"}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeaderCell,
                  { flex: 1, textAlign: "center" },
                ]}
              >
                Count
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
              // Group by date and VG Name
              Object.entries(
                tableData
                  .filter((row) => row[1] === xVGid)
                  .reduce((acc, row) => {
                    const date = row[3] || "-";
                    const addee = row[2] || "";
                    const key = date;
                    if (!acc[key]) acc[key] = { date, count: 0, addees: [] };
                    acc[key].count += 1;
                    if (addee) acc[key].addees.push(addee);
                    return acc;
                  }, {})
              )
                // Sort by date based on sortOrder
                .sort((a, b) => {
                  const dateA = parseDateString(a[1].date);
                  const dateB = parseDateString(b[1].date);
                  return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
                })
                .map(([key, group], idx) => {
                  // Parse the date string
                  const dateObj = parseDateString(group.date);
                  const isCurrentWeek = isDateInCurrentWeek(dateObj);

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.tableRow,
                        { width: "100%" },
                        isCurrentWeek && { backgroundColor: "#ffe082" }, // Highlight with a light yellow
                      ]}
                    >
                      <Text
                        style={[
                          styles.tableCell,
                          { minWidth: 110, maxWidth: 140, textAlign: "left" },
                        ]}
                      >
                        {group.date}
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          { flex: 1, textAlign: "center" },
                        ]}
                      >
                        {group.count}
                        {group.count > 0 && (
                          <Text style={{ color: "#888", fontSize: 13 }}>
                            {" "}
                            {group.count === 1 ? "(attendee)" : "(attendees)"}
                          </Text>
                        )}
                      </Text>
                    </View>
                  );
                })
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
