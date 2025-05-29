import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { format, parse } from 'date-fns';
import { useTrack } from '@/context/TrackContext';
import { ChevronLeft, CreditCard as Edit3 } from 'lucide-react-native';
import Header from '@/components/Header';

export default function ScoreDetails() {
  const { date: dateParam } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { scores } = useTrack();
  
  const date = parse(dateParam, 'yyyy-MM-dd', new Date());
  const scoreData = scores[dateParam];

  const getScoreColor = (score: number) => {
    if (score <= 25) return COLORS.scoreLow;
    if (score <= 50) return COLORS.scoreMediumLow;
    if (score <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Moderate';
      case 4: return 'Hard';
      case 5: return 'Very Hard';
      default: return 'Moderate';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Entry</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>{format(date, 'EEEE, MMMM d, yyyy')}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Effort Score</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(scoreData.score) }]}>
            {scoreData.score}
            <Text style={styles.scoreMax}>/100</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Perceived Difficulty</Text>
          <Text style={styles.difficultyValue}>
            {getDifficultyLabel(scoreData.difficulty)}
          </Text>
        </View>

        {scoreData.reflection && (
          <View style={styles.card}>
            <Text style={styles.label}>Reflection</Text>
            <Text style={styles.reflectionText}>{scoreData.reflection}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => router.push({
            pathname: '/history/edit',
            params: { date: dateParam }
          })}
        >
          <Edit3 size={20} color={COLORS.textPrimary} style={styles.editIcon} />
          <Text style={styles.editButtonText}>Edit Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  date: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
  },
  scoreMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  difficultyValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  reflectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});