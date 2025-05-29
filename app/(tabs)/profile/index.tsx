import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Settings, CircleHelp as HelpCircle, LayoutGrid, Calendar } from 'lucide-react-native';
import { useTrack } from '@/context/TrackContext';
import CalendarLayout from '@/components/CalendarLayout';
import BlockLayout from '@/components/BlockLayout';
import { addMonths, subMonths } from 'date-fns';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { scores, getStreak, getCompletionRate, getAllTimeAverage } = useTrack();
  const [viewMode, setViewMode] = useState<'calendar' | 'block'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Calculate responsive font size for stat labels
  const getStatLabelSize = () => {
    if (width < 350) return 11;
    if (width < 400) return 12;
    return 13;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => setViewMode(prev => prev === 'calendar' ? 'block' : 'calendar')}
          >
            {viewMode === 'calendar' ? (
              <LayoutGrid size={24} color={COLORS.textPrimary} />
            ) : (
              <Calendar size={24} color={COLORS.textPrimary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => router.push('/profile/support')}
          >
            <HelpCircle size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => router.push('/profile/settings')}
          >
            <Settings size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.email}>demo@example.com</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getStreak()}</Text>
              <Text style={[styles.statLabel, { fontSize: getStatLabelSize() }]}>Days Tracked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(getCompletionRate())}%</Text>
              <Text style={[styles.statLabel, { fontSize: getStatLabelSize() }]}>Completion</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getAllTimeAverage().toFixed(1)}</Text>
              <Text style={[styles.statLabel, { fontSize: getStatLabelSize() }]}>Avg Score</Text>
            </View>
          </View>
        </View>

        <View style={styles.trackingSection}>
          {viewMode === 'calendar' ? (
            <CalendarLayout
              currentMonth={currentMonth}
              scores={scores}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          ) : (
            <BlockLayout scores={scores} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: COLORS.textPrimary,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderColor,
    marginHorizontal: 16,
  },
  trackingSection: {
    flex: 1,
    paddingTop: 20,
  },
});