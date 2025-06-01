import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Settings, CircleHelp as HelpCircle, LayoutGrid, Calendar, History, Target } from 'lucide-react-native';
import { useTrack } from '@/context/TrackContext';
import CalendarLayout from '@/components/CalendarLayout';
import BlockLayout from '@/components/BlockLayout';
import { addMonths, subMonths } from 'date-fns';

type TabType = 'history' | 'goal' | 'calendar';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { scores, getStreak, getCompletionRate, getAllTimeAverage } = useTrack();
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [viewMode, setViewMode] = useState<'calendar' | 'block'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const renderHistoryTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.placeholderContainer}>
          <History size={48} color={COLORS.textSecondary} />
          <Text style={styles.placeholderTitle}>History</Text>
          <Text style={styles.placeholderText}>
            Your tracking history and analytics will appear here.
          </Text>
        </View>
      </View>
    );
  };

  const renderGoalTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.placeholderContainer}>
          <Target size={48} color={COLORS.textSecondary} />
          <Text style={styles.placeholderTitle}>Goals</Text>
          <Text style={styles.placeholderText}>
            Set and track your personal goals and targets here.
          </Text>
        </View>
      </View>
    );
  };

  const renderCalendarTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* View Mode Toggle for Calendar Tab */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.viewModeButton} 
            onPress={() => setViewMode(prev => prev === 'calendar' ? 'block' : 'calendar')}
          >
            {viewMode === 'calendar' ? (
              <LayoutGrid size={20} color={COLORS.textPrimary} />
            ) : (
              <Calendar size={20} color={COLORS.textPrimary} />
            )}
            <Text style={styles.viewModeText}>
              {viewMode === 'calendar' ? 'Grid View' : 'Calendar View'}
            </Text>
          </TouchableOpacity>
        </View>

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
      </View>
    );
  };

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'history': return renderHistoryTab();
      case 'goal': return renderGoalTab();
      case 'calendar': return renderCalendarTab();
      default: return renderCalendarTab();
    }
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

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <History size={18} color={activeTab === 'history' ? COLORS.textPrimary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'goal' && styles.activeTab]}
          onPress={() => setActiveTab('goal')}
        >
          <Target size={18} color={activeTab === 'goal' ? COLORS.textPrimary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'goal' && styles.activeTabText]}>
            Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Calendar size={18} color={activeTab === 'calendar' ? COLORS.textPrimary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentTab()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundDark,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingTop: 16,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  placeholderTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  calendarHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  viewModeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  trackingSection: {
    paddingTop: 8,
  },
});