import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { format, parseISO } from 'date-fns';
import { useTrack } from '@/context/TrackContext';
import { CreditCard as Edit3, ChevronLeft } from 'lucide-react-native';
import ScoreInput from '@/components/ScoreInput';
import { useState } from 'react';

export default function ScoreDetails() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const { scores, addScore } = useTrack();
  const [showEdit, setShowEdit] = useState(false);

  const parsedDate = parseISO(date as string);
  const scoreData = scores[date as string];

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

  const handleScoreSubmit = (data: { score: number; difficulty: number; reflection?: string }) => {
    addScore(data, parsedDate);
    setShowEdit(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.backgroundDark,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontFamily: 'Inter-Bold',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
          title: format(parsedDate, 'MMMM d, yyyy'),
        }}
      />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scoreSection}>
          <Text style={styles.label}>Effort Score</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor(scoreData.score) }]}>
            {scoreData.score}
            <Text style={styles.scoreMax}>/100</Text>
          </Text>
        </View>

        <View style={styles.difficultySection}>
          <Text style={styles.label}>Perceived Difficulty</Text>
          <Text style={styles.difficultyValue}>
            {getDifficultyLabel(scoreData.difficulty)}
          </Text>
        </View>

        {scoreData.reflection && (
          <View style={styles.reflectionSection}>
            <Text style={styles.label}>Reflection</Text>
            <Text style={styles.reflectionText}>{scoreData.reflection}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => setShowEdit(true)}
        >
          <Edit3 size={20} color={COLORS.textPrimary} style={styles.editIcon} />
          <Text style={styles.editButtonText}>Edit Entry</Text>
        </TouchableOpacity>
      </ScrollView>

      {showEdit && (
        <ScoreInput
          initialData={scoreData}
          onSubmit={handleScoreSubmit}
          onCancel={() => setShowEdit(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  backButton: {
    marginRight: 8,
  },
  scoreSection: {
    marginBottom: 24,
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
  difficultySection: {
    marginBottom: 24,
  },
  difficultyValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  reflectionSection: {
    marginBottom: 24,
  },
  reflectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
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