import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { format, subDays, isAfter, isBefore, parseISO, isToday } from 'date-fns';
import ScoreInput from './ScoreInput';
import { useTrack } from '@/context/TrackContext';

type ScoreData = {
  score: number;
  difficulty?: number;
  reflection?: string;
};

type BlockLayoutProps = {
  scores: Record<string, number | ScoreData>;
};

const GRID_PADDING = 12;
const GRID_SPACING = 4;
const ITEMS_PER_ROW = 5;
const TOTAL_BLOCKS = 30;

export default function BlockLayout({ scores }: BlockLayoutProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const today = useRef(new Date()).current;
  const [showRating, setShowRating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { addScore } = useTrack();

  // Calculate item size based on screen dimensions
  const getItemSize = () => {
    const availableWidth = screenWidth - (GRID_PADDING * 2);
    const availableHeight = screenHeight - 150; // Account for header and padding
    
    // Calculate sizes based on width and height constraints
    const widthBasedSize = (availableWidth - (GRID_SPACING * (ITEMS_PER_ROW - 1))) / ITEMS_PER_ROW;
    const heightBasedSize = (availableHeight - (GRID_SPACING * (Math.ceil(TOTAL_BLOCKS / ITEMS_PER_ROW) - 1))) / Math.ceil(TOTAL_BLOCKS / ITEMS_PER_ROW);
    
    // Use the smaller of the two to ensure squares fit both dimensions
    return Math.min(widthBasedSize, heightBasedSize);
  };

  const itemSize = getItemSize();

  // Find the appropriate start date on component mount
  useEffect(() => {
    const findStartDate = () => {
      let date = subDays(today, 29); // Start from 29 days ago
      const dateStrings = Object.keys(scores).sort();
      
      if (dateStrings.length === 0) {
        // No scores, use today as end date
        setStartDate(date);
        return;
      }

      setStartDate(date);
    };

    findStartDate();
  }, [scores, today]);

  const getScoreValue = (scoreData: number | ScoreData | null): number | null => {
    if (scoreData === null) return null;
    if (typeof scoreData === 'number') return scoreData;
    return scoreData.score;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return COLORS.cardBackground;
    if (score <= 25) return COLORS.scoreLow;
    if (score <= 50) return COLORS.scoreMediumLow;
    if (score <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  const handleDayPress = (date: Date) => {
    if (!isAfter(date, today)) {
      setSelectedDate(date);
      setShowRating(true);
    }
  };

  const handleScoreSubmit = (data: { score: number; difficulty: number; reflection?: string }) => {
    if (selectedDate) {
      addScore(data.score, selectedDate);
      setShowRating(false);
      setSelectedDate(null);
    }
  };

  const renderBlocks = () => {
    const blocks = [];
    let currentDate = startDate;

    // Generate blocks for 30 days starting from startDate
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      const scoreData = scores[dateString] || null;
      const scoreValue = getScoreValue(scoreData);
      const formattedDate = format(currentDate, 'M/d');
      const isRatable = !isAfter(currentDate, today);
      const isCurrentDay = isToday(currentDate);
      
      blocks.push(
        <TouchableOpacity 
          key={dateString} 
          onPress={() => handleDayPress(currentDate)}
          disabled={!isRatable}
        >
          <View 
            style={[
              styles.block,
              { 
                width: itemSize,
                height: itemSize,
                backgroundColor: getScoreColor(scoreValue),
                opacity: isRatable ? 1 : 0.5,
                borderColor: isCurrentDay ? COLORS.primary : COLORS.borderColor,
                borderWidth: isCurrentDay ? 2 : 1,
              }
            ]}
          >
            {scoreValue !== null ? (
              <Text style={[styles.scoreText, { fontSize: itemSize * 0.3 }]}>{scoreValue}</Text>
            ) : (
              <Text style={[styles.dateText, { fontSize: itemSize * 0.25 }]}>{formattedDate}</Text>
            )}
          </View>
        </TouchableOpacity>
      );

      currentDate = subDays(currentDate, -1);
    }

    return blocks;
  };

  const handleScroll = (event: any) => {
    // Implement infinite scroll logic here when needed
    // This would load previous 30-day chunks when scrolling up
  };

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.grid, { gap: GRID_SPACING }]}>
          {renderBlocks()}
        </View>
      </ScrollView>

      {showRating && (
        <ScoreInput
          onSubmit={handleScoreSubmit}
          onCancel={() => {
            setShowRating(false);
            setSelectedDate(null);
          }}
        />
      )}
    </>
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    color: COLORS.textSecondary,
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    color: COLORS.textPrimary,
  },
});