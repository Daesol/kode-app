import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/constants/theme';

type SplashScreenProps = {
  fontsLoaded: boolean;
};

export default function SplashScreen({ fontsLoaded }: SplashScreenProps) {
  return (
    <View style={styles.splashContainer}>
      <Text style={[styles.splashTitle, !fontsLoaded && styles.fallbackFont]}>
        LOCK'N
      </Text>
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
