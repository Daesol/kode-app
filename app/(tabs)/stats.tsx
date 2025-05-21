import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT } from '@/constants/theme';
import { useTrack } from '@/context/TrackContext';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import WeeklyBarChart from '@/components/WeeklyBarChart';
import { format, subDays } from 'date-fns';
import { Flame, Calendar, TrendingUp, Award } from 'lucide-react-native';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { 
    scores, 
    getStreak, 
    getAllTimeAverage, 
    getCompletionRate, 
    getWeeklyData 
  } = useTrack();
  
  const [streak, setStreak] = useState(0);
  const [average, setAverage] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  
  useEffect(() => {
    setStreak(getStreak());
    setAverage(getAllTimeAverage());
    setCompletionRate(getCompletionRate());
    setWeeklyData(getWeeklyData());
  }, [scores]);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Statistics" />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statCardsContainer}>
          <View style={styles.statCardRow}>
            <StatCard 
              title="Current Streak"
              value={`${streak} day${streak !== 1 ? 's' : ''}`}
              icon={<Flame size={22} color={COLORS.accent} />}
              color={COLORS.accent}
            />
            
            <StatCard 
              title="Completion Rate"
              value={`${Math.round(completionRate)}%`}
              icon={<Calendar size={22} color={COLORS.primary} />}
              color={COLORS.primary}
            />
          </View>
          
          <View style={styles.statCardRow}>
            <StatCard 
              title="All-time Average"
              value={`${average.toFixed(1)}/100`}
              icon={<TrendingUp size={22} color={COLORS.secondary} />}
              color={COLORS.secondary}
            />
            
            <StatCard 
              title="Total Entries"
              value={`${Object.keys(scores).length}`}
              icon={<Award size={22} color={COLORS.tertiary} />}
              color={COLORS.tertiary}
            />
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Last 7 Days</Text>
          <WeeklyBarChart data={weeklyData} />
          
          <View style={styles.chartLegend}>
            {[0, 25, 50, 75, 100].map(value => (
              <Text key={value} style={styles.chartLegendText}>{value}</Text>
            ))}
          </View>
          
          <View style={styles.daysContainer}>
            {Array.from({ length: 7 }).map((_, index) => {
              const date = subDays(new Date(), 6 - index);
              return (
                <Text key={index} style={styles.dayText}>
                  {format(date, 'EEE')}
                </Text>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statCardsContainer: {
    marginBottom: 25,
  },
  statCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  chartTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  chartLegendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  dayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 30,
    textAlign: 'center',
  },
});