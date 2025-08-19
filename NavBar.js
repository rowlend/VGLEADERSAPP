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
          <Text style={styles.navLabel}>home</Text>
        </TouchableOpacity>
        {/* Nav 2: Bible */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Bible")}
        >
          <Image
            source={require("./assets/bible.png")}
            style={styles.navIconLarge}
            resizeMode="contain"
          />
          <Text style={styles.navLabel}>bible</Text>
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
          <Text style={styles.navLabel}>events</Text>
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
          <Text style={styles.navLabel}>prayer</Text>
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
  navLabel: {
    fontSize: 9,
    color: "#22336B", // or "#333" for dark gray
    marginTop: 2,
    fontFamily: "Arial",
    fontWeight: "normal",
  },
});
