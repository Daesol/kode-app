import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/theme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type WeeklyBarChartProps = {
  data: number[];
};

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const getBarColor = (value: number) => {
    if (value <= 25) return COLORS.scoreLow;
    if (value <= 50) return COLORS.scoreMediumLow;
    if (value <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {/* Background grid lines */}
        <View style={[styles.gridLine, { bottom: '25%' }]} />
        <View style={[styles.gridLine, { bottom: '50%' }]} />
        <View style={[styles.gridLine, { bottom: '75%' }]} />
        <View style={[styles.gridLine, { bottom: '100%' }]} />
        
        {/* Bars */}
        {data.map((value, index) => (
          <AnimatedBar 
            key={index} 
            value={value} 
            index={index} 
            color={getBarColor(value)} 
          />
        ))}
      </View>
    </View>
  );
}

type AnimatedBarProps = {
  value: number;
  index: number;
  color: string;
};

function AnimatedBar({ value, index, color }: AnimatedBarProps) {
  const barHeight = value ? value : 0;
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(`${barHeight}%`, { duration: 1000 }),
      backgroundColor: color,
    };
  });

  return (
    <View style={styles.barContainer}>
      <Animated.View style={[styles.bar, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.borderColor,
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});