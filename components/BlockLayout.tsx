import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS } from '@/constants/theme';
import { format, subDays, startOfYear, differenceInDays } from 'date-fns';

type ScoreEntry = {
  score: number;
  difficulty: number;
  reflection?: string;
};

type BlockLayoutProps = {
  scores: Record<string, ScoreEntry>;
};

const GRID_PADDING = 12;
const GRID_SPACING = 2;
const ITEMS_PER_ROW = 20;
const TOTAL_BLOCKS = 365;

export default function BlockLayout({ scores }: BlockLayoutProps) {
  const { width: screenWidth } = useWindowDimensions();
  const today = new Date();
  const yearStart = startOfYear(today);
  const daysSinceYearStart = differenceInDays(today, yearStart);

  // Calculate item size based on screen width
  const getItemSize = () => {
    const availableWidth = screenWidth - (GRID_PADDING * 2);
    return (availableWidth - (GRID_SPACING * (ITEMS_PER_ROW - 1))) / ITEMS_PER_ROW;
  };

  const itemSize = getItemSize();

  const getScoreColor = (score: number | null) => {
    if (score === null) return COLORS.cardBackground;
    if (score <= 25) return COLORS.scoreLow;
    if (score <= 50) return COLORS.scoreMediumLow;
    if (score <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  const renderBlocks = () => {
    const blocks = [];
    
    // Fill in blocks for the current year
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      let scoreValue = null;
      let dateString = '';
      
      if (i <= daysSinceYearStart) {
        // This is a past or current date in the year
        const date = subDays(today, daysSinceYearStart - i);
        dateString = format(date, 'yyyy-MM-dd');
        const scoreEntry = scores[dateString];
        scoreValue = scoreEntry?.score || null;
      }
      
      blocks.push(
        <View 
          key={dateString || `future-${i}`}
          style={[
            styles.block,
            { 
              width: itemSize,
              height: itemSize,
              backgroundColor: getScoreColor(scoreValue),
              opacity: i <= daysSinceYearStart ? 1 : 0.3, // Dim future dates
            }
          ]}
        />
      );
    }

    return blocks;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gap: GRID_SPACING }]}>
        {renderBlocks()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: GRID_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  block: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
});