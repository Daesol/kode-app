import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { format, isToday, isAfter } from 'date-fns';

type ScoreData = {
  score: number;
  difficulty?: any; // adjust type as needed
};

type ScoreCellProps = {
  date: Date;
  score: number | ScoreData | null;
  onPress?: (date: Date) => void;
};

export default function ScoreCell({ date, score, onPress }: ScoreCellProps) {
  const day = date.getDate();
  const isCurrentDay = isToday(date);
  const isFutureDate = isAfter(date, new Date());
  
  // Extract the numeric score value
  const scoreValue = typeof score === 'object' && score !== null 
    ? score.score 
    : score;
  
  const getScoreColor = (value: number) => {
    if (value <= 25) return COLORS.scoreLow;
    if (value <= 50) return COLORS.scoreMediumLow;
    if (value <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };
  
  return (
    <TouchableOpacity 
      style={styles.cell}
      onPress={() => onPress?.(date)}
      disabled={isFutureDate}
    >
      <View 
        style={[
          styles.cellContent,
          isCurrentDay && styles.today,
          isFutureDate && styles.futureDate
        ]}
      >
        <Text 
          style={[
            styles.dayText,
            isCurrentDay && styles.todayText
          ]}
        >
          {day}
        </Text>
        
        {scoreValue !== null && (
          <View 
            style={[
              styles.scoreIndicator,
              { backgroundColor: getScoreColor(scoreValue) }
            ]}
          >
            <Text style={styles.scoreText}>{scoreValue}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 2,
  },
  cellContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  today: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  futureDate: {
    opacity: 0.5,
  },
  dayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  todayText: {
    color: COLORS.primary,
  },
  scoreIndicator: {
    width: '80%',
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: COLORS.textPrimary,
  },
});