import { Tabs } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ChartBar as BarChart2, Users, Calendar, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useTrack } from '@/context/TrackContext';
import ScoreInput from '@/components/ScoreInput';
import { useState } from 'react';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [showRating, setShowRating] = useState(false);
  const { getTodayScore } = useTrack();
  const todayScore = getTodayScore();

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
        initialRouteName="history"
      >
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => (
              <Calendar size={size} color={color} />
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
          name="rate"
          options={{
            title: '',
            tabBarButton: () => (
              <TouchableOpacity
                style={[
                  styles.rateButton,
                  { bottom: insets.bottom > 0 ? 20 : 10 }
                ]}
                onPress={() => setShowRating(true)}
              >
                <View style={[
                  styles.rateButtonInner,
                  todayScore !== null && styles.rateButtonUpdating
                ]}>
                  <Calendar
                    size={24}
                    color={COLORS.textPrimary}
                    style={styles.rateIcon}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color, size }) => (
              <BarChart2 size={size} color={color} />
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

      {showRating && (
        <ScoreInput
          onSubmit={(score) => {
            setShowRating(false);
          }}
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
  rateButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
  },
  rateButtonInner: {
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
  rateButtonUpdating: {
    backgroundColor: COLORS.secondary,
  },
  rateIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});