import { Tabs } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Chrome as Home, Users, Calendar, User, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useTrack } from '@/context/TrackContext';
import ScoreInput from '@/components/ScoreInput';
import { useState } from 'react';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [showRating, setShowRating] = useState(false);
  const { getTodayScore, addScore } = useTrack();
  const todayScore = getTodayScore();

  const handleScoreSubmit = (score: number) => {
    addScore(score, new Date());
    setShowRating(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: COLORS.backgroundDark,
            borderTopColor: COLORS.borderColor,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
        initialRouteName="home"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: 'Groups',
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color, size }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      
      {/* Floating Action Button for Rating */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { bottom: 70 + insets.bottom }
        ]}
        onPress={() => setShowRating(true)}
        activeOpacity={0.8}
      >
        <Plus size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      
      {showRating && (
        <ScoreInput
          onSubmit={handleScoreSubmit}
          onCancel={() => setShowRating(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 1,
    position: 'relative',
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 5,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});