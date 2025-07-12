import { Colors } from "@/constants/colors";
import { RethinkSans_400Regular, RethinkSans_500Medium, RethinkSans_600SemiBold, RethinkSans_700Bold, useFonts } from '@expo-google-fonts/rethink-sans';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'RethinkSans-Regular': RethinkSans_400Regular,
    'RethinkSans-Medium': RethinkSans_500Medium,
    'RethinkSans-SemiBold': RethinkSans_600SemiBold,
    'RethinkSans-Bold': RethinkSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="event-details" 
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="seat-selection" />
      <Stack.Screen name="ticket-preview" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="booking-confirmation" />
    </Stack>
  );
}
