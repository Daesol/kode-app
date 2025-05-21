import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SHADOW } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type TodayScoreCardProps = {
  score: number;
};

export default function TodayScoreCard({ score }: TodayScoreCardProps) {
  const getScoreColor = () => {
    if (score <= 25) return COLORS.scoreLow;
    if (score <= 50) return COLORS.scoreMediumLow;
    if (score <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  const getGradientColors = () => {
    const baseColor = getScoreColor();
    return [
      `${baseColor}20`, // 20% opacity version of color
      `${baseColor}40`  // 40% opacity version of color
    ];
  };

  const getScoreText = () => {
    if (score <= 25) return 'Low Effort';
    if (score <= 50) return 'Moderate Effort';
    if (score <= 75) return 'Good Effort';
    return 'Excellent Effort';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.scoreLabel}>Today's Effort</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
              {score}
            </Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          
          <Text style={[styles.scoreText, { color: getScoreColor() }]}>
            {getScoreText()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOW.small,
  },
  gradientBackground: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  scoreLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
    color: COLORS.primary,
  },
  scoreMax: {
    fontFamily: 'Inter-Medium',
    fontSize: 24,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  scoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.primary,
  },
});