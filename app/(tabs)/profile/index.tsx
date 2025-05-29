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

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>JD</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>John Doe</Text>
            <Text style={styles.headerEmail}>demo@example.com</Text>
          </View>
        </View>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => setViewMode(prev => prev === 'calendar' ? 'block' : 'calendar')}
          >
            {viewMode === 'calendar' ? (
              <LayoutGrid size={20} color={COLORS.textPrimary} />
            ) : (
              <Calendar size={20} color={COLORS.textPrimary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => router.push('/profile/support')}
          >
            <HelpCircle size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => router.push('/profile/settings')}
          >
            <Settings size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Compact Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getStreak()}</Text>
          <Text style={styles.statLabel}>Days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(getCompletionRate())}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getAllTimeAverage().toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tracking Visualization */}
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

        {/* Reserved space for future content */}
        <View style={styles.futureContentSpace}>
          {/* This space is now available for additional features like:
              - Achievement badges
              - Goals/targets
              - Recent activity feed
              - Social features
              - Settings shortcuts
              - Insights/analytics
          */}
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
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  headerEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 12,
    padding: 8,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  trackingSection: {
    paddingTop: 16,
  },
  futureContentSpace: {
    minHeight: 200,
    paddingHorizontal: 16,
    paddingVertical: 20,
    // This space is ready for future content
  },
});