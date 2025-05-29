// SplashScreen.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/constants/theme';
import Animated, { FadeIn } from 'react-native-reanimated';

type SplashScreenProps = {
  fontsLoaded: boolean;
};

export default function SplashScreen({ fontsLoaded }: SplashScreenProps) {
  return (
    <View style={styles.splashContainer}>
      {/* Text logo with fade-in animation */}
      <Animated.Text 
        style={[styles.splashTitle, !fontsLoaded && styles.fallbackFont]}
        entering={FadeIn.duration(800).delay(200)}
      >
        LOCK'N
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  splashTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: COLORS.primary,
  },
  fallbackFont: {
    fontFamily: undefined,
    fontWeight: 'bold',
  },
});