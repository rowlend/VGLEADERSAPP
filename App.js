import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const AttendanceHomeScreen = require("./AttendanceHomeScreen").default;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="AttendanceHome"
          component={AttendanceHomeScreen}
          options={{ title: "Attendance Home" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
