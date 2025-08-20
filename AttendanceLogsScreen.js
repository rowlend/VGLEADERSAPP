import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AttendanceLogsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Logs</Text>
      <Text style={styles.title}>under construction!</Text>
      {/* Add your logs content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22336B",
  },
});
