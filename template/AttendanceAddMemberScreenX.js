import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";

export default function AttendanceAddMemberScreen() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Add VG Member</Text>
        <Text style={styles.title}>under construction!</Text>
        {/* Add your add member form or content here */}
      </SafeAreaView>

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
