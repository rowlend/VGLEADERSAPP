import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PassedAttendanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passed Attendance</Text>
      {/* Add your content here */}
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
