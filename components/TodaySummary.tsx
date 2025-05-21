import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SHADOW } from '@/constants/theme';
import { TrendingUp } from 'lucide-react-native';

type TodaySummaryProps = {
  weekAverage: number;
};

export default function TodaySummary({ weekAverage }: TodaySummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.iconContainer}>
          <TrendingUp size={24} color={COLORS.secondary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>This Week's Average</Text>
          <Text style={styles.value}>{weekAverage.toFixed(1)}<Text style={styles.unit}>/100</Text></Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW.small,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  unit: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});