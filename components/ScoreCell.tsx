import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { format, isToday, isFuture } from 'date-fns';
import { useTrack } from '@/context/TrackContext';

type ScoreCellProps = {
  date: Date;
  score: number | null;
  onRate?: () => void;
};

export default function ScoreCell({ date, score, onRate }: ScoreCellProps) {
  const day = date.getDate();
  const isCurrentDay = isToday(date);
  const isFutureDate = isFuture(date);
  
  const getScoreColor = (value: number) => {
    if (value <= 25) return COLORS.scoreLow;
    if (value <= 50) return COLORS.scoreMediumLow;
    if (value <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };
  
  return (
    <TouchableOpacity 
      style={styles.cell}
      onPress={onRate}
      disabled={isFutureDate || score !== null}
    >
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
    </TouchableOpacity>
  );
}