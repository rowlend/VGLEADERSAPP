import React from "react";
import NavBar from "./NavBar";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function EvangelismHomeScreen() {
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", paddingTop: 0 }}
        edges={["top"]}
      >
        {/* Body divided into 4 quadrants */}
        <View style={{ flex: 1, width: "100%", flexDirection: "row" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.quadrantTL}>
              {/* Top Left: ToolBestNews image */}
              <Image
                source={require("./assets/ToolBestNews.png")}
                style={{ width: 150, height: 150 }} // Increased by 50%
                resizeMode="contain"
              />
            </View>
            <View style={styles.quadrantBL}>
              {/* Bottom Left: ToolUnconditionalLoveSurvey image */}
              <Image
                source={require("./assets/ToolUnconditionalLoveSurvey.png")}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={styles.quadrantTR}>
              {/* Top Right: ToolOne2one image */}
              <Image
                source={require("./assets/ToolOne2one.png")}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.quadrantBR}>
              {/* Bottom Right: ToolOthers image */}
              <Image
                source={require("./assets/ToolOthers.png")}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      {/* NavBar */}
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
      {/* Footer */}
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
  quadrantTL: {
    flex: 1,
    backgroundColor: "#fff", // Changed to white
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quadrantTR: {
    flex: 1,
    backgroundColor: "#fff", // Changed to white
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quadrantBL: {
    flex: 1,
    backgroundColor: "#fff", // Changed to white
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quadrantBR: {
    flex: 1,
    backgroundColor: "#fff", // Changed to white
    justifyContent: "center",
    alignItems: "center",
  },
});
