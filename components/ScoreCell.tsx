import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '@/constants/theme';
import { format, isToday } from 'date-fns';

type ScoreCellProps = {
  date: Date;
  score: number | null;
};

export default function ScoreCell({ date, score }: ScoreCellProps) {
  const day = date.getDate();
  const isCurrentDay = isToday(date);
  
  const getScoreColor = (value: number) => {
    if (value <= 25) return COLORS.scoreLow;
    if (value <= 50) return COLORS.scoreMediumLow;
    if (value <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };
  
  return (
    <View style={styles.cell}>
      <View 
        style={[
          styles.cellContent,
          isCurrentDay && styles.today
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
        
        {score !== null && (
          <View 
            style={[
              styles.scoreIndicator,
              { backgroundColor: getScoreColor(score) }
            ]}
          >
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        )}
      </View>
    </View>
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