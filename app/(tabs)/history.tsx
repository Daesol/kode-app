import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useTrack } from '@/context/TrackContext';
import { subMonths, addMonths, getMonth, getYear } from 'date-fns';
import Header from '@/components/Header';
import CalendarLayout from '@/components/CalendarLayout';
import BlockLayout from '@/components/BlockLayout';
import { LayoutGrid, Calendar } from 'lucide-react-native';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { scores } = useTrack();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'block'>('calendar');
  
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    const now = new Date();
    if (getMonth(nextMonth) <= getMonth(now) && getYear(nextMonth) <= getYear(now)) {
      setCurrentMonth(nextMonth);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Header title="History" />
        <TouchableOpacity 
          style={styles.viewModeButton}
          onPress={() => setViewMode(prev => prev === 'calendar' ? 'block' : 'calendar')}
        >
          {viewMode === 'calendar' ? (
            <LayoutGrid size={24} color={COLORS.textPrimary} />
          ) : (
            <Calendar size={24} color={COLORS.textPrimary} />
          )}
        </TouchableOpacity>
      </View>
      
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  viewModeButton: {
    padding: 8,
  },
});