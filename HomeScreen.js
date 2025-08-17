import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>VG Leaders App</Text>
    </View>
  );
}

function Body({ navigation }) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.body,
        {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        },
      ]}
    >
      <View style={styles.segment}>
        <View style={styles.bodyRow}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            onPress={() => {
              console.log("Attendance button pressed");
              navigation && navigation.navigate("Login");
            }}
          >
            <Image
              source={require("./assets/attendance.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyRow}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            onPress={() => {
              /* TODO: handle tools button press */
            }}
          >
            <Image
              source={require("./assets/tools.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyRow}>
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            onPress={() => {
              /* TODO: handle settings button press */
            }}
          >
            <Image
              source={require("./assets/settings.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function Footer() {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.footerContainer}>
      <View style={styles.footer}>
        <Text style={styles.footerBy}>by prowapps</Text>
      </View>
    </SafeAreaView>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header />
      <Body navigation={navigation} />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  bodyRow: {
    width: "100%",
    height: 140,
    backgroundColor: "#e0e0e0",
    marginVertical: 0,
    borderRadius: 0,
    padding: 0,
  },
  segment: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  header: {
    height: 120,
    backgroundColor: "#4F8EF7",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 30,
    flexShrink: 0,
    paddingLeft: 24,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  footerContainer: {
    // No absolute positioning, let flexbox handle stacking
  },
  footer: {
    height: 60,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  footerBy: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 2,
  },
});
