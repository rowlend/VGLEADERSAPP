import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import AttendanceHomeScreen from "./AttendanceHomeScreen";
import AttendanceLogsScreen from "./AttendanceLogsScreen";
import AttendanceSubmitScreen from "./AttendanceSubmitScreen"; // Make sure this exists
import AttendanceAddMemberScreen from "./AttendanceAddMemberScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {"VGLeadersAppScreens"}
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
          name="AttendanceHomeScreen"
          component={AttendanceHomeScreen}
          options={{ title: "Attendance Home" }}
        />
        <Stack.Screen
          name="AttendanceLogsScreen"
          component={AttendanceLogsScreen}
          options={{ title: "Attendance Logs" }}
        />
        <Stack.Screen
          name="AttendanceSubmitScreen"
          component={AttendanceSubmitScreen}
          options={{ title: "Submit Attendance" }}
        />
        <Stack.Screen
          name="AttendanceAddMemberScreen"
          component={AttendanceAddMemberScreen}
          options={{ title: "Add VG Member" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
