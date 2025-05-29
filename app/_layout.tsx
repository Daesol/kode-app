import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { TrackProvider } from '@/context/TrackContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import CustomSplashScreen from '@/components/SplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isAuthenticated } = useAuth();
  const routerInstance = useRouter();
  const segments = useSegments();
  
  const hasNavigated = useRef(false);
  const [showSplash, setShowSplash] = useState(true);
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(err => console.log("Error hiding splash:", err));
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    console.log("Current segments:", segments);
    console.log("Is authenticated:", isAuthenticated);
  }, [segments, isAuthenticated]);

  const handleAnimationComplete = () => {
    if (!hasNavigated.current) {
      console.log("Animation complete, navigating...");
      hasNavigated.current = true;
      setShowSplash(false);
      
      // Make sure we're navigating to the exact route
      const route = isAuthenticated ? '/home' : '/login';
      console.log("Navigating to:", route);
      
      setTimeout(() => {
        routerInstance.replace(route);
      }, 100);
    }
  };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (!hasNavigated.current) {
        const timer = setTimeout(() => {
          handleAnimationComplete();
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [fontsLoaded, fontError]);

  if (showSplash) {
    return (
      <CustomSplashScreen 
        fontsLoaded={fontsLoaded || !!fontError} 
      />
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <TrackProvider>
          <AppContent />
        </TrackProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});