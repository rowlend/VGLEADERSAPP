import React from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>VG Leaders App</Text>
    </View>
  );
}

function Body() {
  return (
    <View style={styles.body}>
      <Text style={styles.bodyText}>Welcome to VG Leaders App!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ATTENDANCE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>TOOLS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>SETTINGS</Text>
      </TouchableOpacity>
    </View>
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

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Body />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  header: {
    height: 80,
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
    paddingHorizontal: 24,
  },
  bodyText: {
    fontSize: 18,
    color: "#333",
    fontFamily: Platform.select({
      ios: 'Arial Rounded MT Bold',
      android: 'sans-serif',
      default: 'Arial',
    }),
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#4F8EF7',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
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
  footerText: {
    color: "#888",
    fontSize: 16,
  },
  footerBy: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 2,
  },
});
