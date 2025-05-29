import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { format, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import ScoreCell from '@/components/ScoreCell';
import ScoreInput from '@/components/ScoreInput';
import ScoreOverlay from '@/components/ScoreOverlay';
import { useTrack } from '@/context/TrackContext';

type ScoreEntry = {
  score: number;
  difficulty: number;
  reflection?: string;
};

type CalendarLayoutProps = {
  currentMonth: Date;
  scores: Record<string, ScoreEntry>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendarLayout({ 
  currentMonth, 
  scores,
  onPrevMonth,
  onNextMonth
}: CalendarLayoutProps) {
  const [showRating, setShowRating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { addScore } = useTrack();

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    const dateString = format(date, 'yyyy-MM-dd');
    const existingScore = scores[dateString];

    if (existingScore) {
      setShowOverlay(true);
    } else {
      setShowRating(true);
    }
  };

  const handleScoreSubmit = (data: { score: number; difficulty: number; reflection?: string }) => {
    if (selectedDate) {
      addScore(data, selectedDate);
      setShowRating(false);
      setSelectedDate(null);
    }
  };

  const handleEdit = () => {
    setShowOverlay(false);
    setShowRating(true);
  };

  const renderMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthStartDay = monthStart.getDay();
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < monthStartDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.emptyDay} />
      );
    }
    
    // Calculate days in month
    const daysInMonth = new Date(
      currentMonth.getFullYear(), 
      currentMonth.getMonth() + 1, 
      0
    ).getDate();
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = format(date, 'yyyy-MM-dd');
      const scoreData = scores[dateString];
      
      days.push(
        <ScoreCell 
          key={dateString}
          date={date}
          score={scoreData?.score || null}
          onPress={handleDayPress}
        />
      );
    }
    
    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={onPrevMonth} style={styles.monthButton}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        
        <TouchableOpacity 
          onPress={onNextMonth} 
          style={styles.monthButton}
        >
          <ChevronRight size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekdaysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {renderMonthDays()}
        </View>
      </View>

      {showRating && selectedDate && (
        <ScoreInput
          initialData={selectedDate ? scores[format(selectedDate, 'yyyy-MM-dd')] : undefined}
          onSubmit={handleScoreSubmit}
          onCancel={() => {
            setShowRating(false);
            setSelectedDate(null);
          }}
        />
      )}

      {showOverlay && selectedDate && (
        <ScoreOverlay
          date={selectedDate}
          scoreData={scores[format(selectedDate, 'yyyy-MM-dd')]}
          onClose={() => {
            setShowOverlay(false);
            setSelectedDate(null);
          }}
          onEdit={handleEdit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
});