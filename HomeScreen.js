import React, { useState } from "react";
import homeIcon from "./assets/home.png";
import bibleIcon from "./assets/bible.png";
import eventsIcon from "./assets/events.png";
import prayerIcon from "./assets/prayer.png";
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
import NavBar from "./NavBar";

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>VG Leaders App</Text>
      <Image
        source={require("./assets/VictoryLogo_White.png")}
        style={styles.headerLogo}
      />
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
      <View
        style={[
          styles.segment,
          { height: 80, paddingVertical: 0, justifyContent: "center" },
        ]}
      >
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
      <View style={{ flex: 1, width: "100%" }}>
        <View style={{ flex: 8 }}>
          <Body navigation={navigation} />
        </View>
        <View style={{ flex: 2, justifyContent: "flex-end" }}>
          <NavBar navigation={navigation} />
        </View>
      </View>
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
    backgroundColor: "#22336B",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: 30,
    flexShrink: 0,
    paddingLeft: 24,
    paddingRight: 24,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 48, // Add this line to vertically align with the logo
  },
  headerLogo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
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
