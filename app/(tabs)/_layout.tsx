import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  console.log("TabLayout rendering");
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundDark,
          borderTopColor: COLORS.borderColor,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>H</Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            console.log("Home tab pressed");
          },
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>G</Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            console.log("Groups tab pressed");
          },
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>S</Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            console.log("Stats tab pressed");
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>P</Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            console.log("Profile tab pressed");
          },
        }}
      />
    </Tabs>
  );
}