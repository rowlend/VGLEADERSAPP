import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navBarContainer}>
      <View style={styles.navBarRow}>
        {/* Nav 1: Home */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("./assets/home.png")}
            style={styles.navIconLarge}
            resizeMode="contain"
          />
          <Text style={styles.navLabelHome}>home</Text>
        </TouchableOpacity>
        {/* Nav 2: evangelism tools */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("EvangelismHomeScreen")}
        >
          <Image
            source={require("./assets/evangelism.png")}
            style={styles.navIconLarge}
            resizeMode="contain"
          />
          <Text style={styles.navLabelBible}>evangelism</Text>
        </TouchableOpacity>
        {/* Nav 3: Events */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Events")}
        >
          <Image
            source={require("./assets/events.png")}
            style={styles.navIconLarge}
            resizeMode="contain"
          />
          <Text style={styles.navLabelEvents}>events</Text>
        </TouchableOpacity>
        {/* Nav 4: Prayer */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Prayer")}
        >
          <Image
            source={require("./assets/prayer.png")}
            style={styles.navIconLarge}
            resizeMode="contain"
          />
          <Text style={styles.navLabelPrayer}>prayer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBarContainer: {
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    height: 70,
  },
  navBarRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  navButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    marginHorizontal: 0, // Removed horizontal margin
    backgroundColor: "#fff",
    padding: 0, // Ensure no padding
  },
  navIconLarge: {
    width: 44,
    height: 44,
  },
  navLabelHome: {
    fontSize: 9,
    color: "#22336B",
    marginTop: 2,
    fontFamily: "Arial",
    fontWeight: "bold", // Home label is bold
  },
  navLabel: {
    fontSize: 9,
    color: "#22336B",
    marginTop: 2,
    fontFamily: "Arial",
    fontWeight: "normal",
  },
  navLabelBible: {
    fontSize: 9,
    color: "#22336B",
    marginTop: 2,
    fontFamily: "Arial",
    fontWeight: "bold", // Bible label is bold
  },
  navLabelEvents: {
    fontSize: 9,
    color: "#22336B",
    marginTop: 2,
    fontFamily: "Arial",
    fontWeight: "bold", // Events label is bold
  },
  navLabelPrayer: {
    fontSize: 9,
    color: "#22336B",
    marginTop: 2,
    fontFamily: "Arial",
    fontWeight: "bold", // Prayer label is bold
  },
});
