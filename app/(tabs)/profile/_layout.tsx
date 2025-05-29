import { Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.backgroundDark,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerBackTitle: 'Profile',
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Support',
          headerBackTitle: 'Profile',
        }}
      />
    </Stack>
  );
}