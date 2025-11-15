// app/_layout.tsx
import {NavigationContainer, ThemeProvider} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
// import DetailScreen from "./detail";
import {NAV_THEME} from "@/lib/theme";
import {GymProvider} from "@/utils/GymContext";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import "../global.css";
import CheckInChat from "./CheckInChat";
import ClassDetailScreen from "./class-detail";
import HomeScreen from "./home";
import MemberCheckInScreen from "./member-check-in";
import MemberSearchScreen from "./member-search";
const Stack = createNativeStackNavigator();

// setGlobalFontFamily();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
    "Geist-ExtraLight": require("../assets/fonts/Geist-ExtraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-ExtraBold": require("../assets/fonts/Geist-ExtraBold.ttf")
  });

  // 2. Hide the splash screen once the fonts are loaded (or if there's an error)
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until the fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GymProvider>
      <ThemeProvider value={NAV_THEME["light"]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
            <Stack.Screen name="MemberSearch" component={MemberSearchScreen} />
            <Stack.Screen
              name="MemberCheckIn"
              component={MemberCheckInScreen}
            />
            <Stack.Screen name="CheckInChat" component={CheckInChat} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GymProvider>
  );
}
