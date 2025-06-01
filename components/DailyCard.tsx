import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOW } from '@/constants/theme';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScoreEntry } from '@/context/TrackContext';

type DailyCardProps = {
  date: string; // YYYY-MM-DD format
  scoreData: ScoreEntry;
};

export default function DailyCard({ date, scoreData }: DailyCardProps) {
  const router = useRouter();
  const [isReflectionExpanded, setIsReflectionExpanded] = useState(false);
  
  // Parse date string reliably without timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = format(dateObj, 'MMM dd, yyyy');
  const dayOfWeek = format(dateObj, 'EEEE');

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

  const formatTime = (hour?: string, minute?: string, period?: 'AM' | 'PM') => {
    if (!hour || !minute || !period) return '';
    return `${hour}:${minute.padStart(2, '0')} ${period}`;
  };

  const handleCardPress = () => {
    router.push(`/score/${date}`);
  };

  const handleReflectionToggle = (e: any) => {
    e.stopPropagation();
    setIsReflectionExpanded(!isReflectionExpanded);
  };

  const hasReflection = scoreData.reflection && scoreData.reflection.trim().length > 0;
  const hasAchievements = scoreData.achievements && scoreData.achievements.length > 0;
  const hasDistractions = scoreData.distractions && scoreData.distractions.length > 0;
  const wakeUpTime = formatTime(scoreData.wakeUpHour, scoreData.wakeUpMinute, scoreData.wakeUpPeriod);
  const bedTime = formatTime(scoreData.bedtimeHour, scoreData.bedtimeMinute, scoreData.bedtimePeriod);

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.7}>
      {/* Row 1: Profile pic, name, date, scores */}
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.dateText}>{dayOfWeek}, {formattedDate}</Text>
        </View>
        <View style={styles.scores}>
          <View style={[styles.scoreChip, { backgroundColor: getScoreColor(scoreData.score) }]}>
            <Text style={styles.scoreText}>{scoreData.score}</Text>
          </View>
          <Text style={styles.difficultyText}>{getDifficultyLabel(scoreData.difficulty)}</Text>
        </View>
      </View>

      {/* Row 2: Achievements */}
      {hasAchievements && (
        <View style={styles.achievementsRow}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.listContainer}>
            {scoreData.achievements!.map((achievement, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.listText}>{achievement}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Row 3: Distractions */}
      {hasDistractions && (
        <View style={styles.distractionsRow}>
          <Text style={styles.sectionTitle}>Distractions</Text>
          <View style={styles.listContainer}>
            {scoreData.distractions!.map((distraction, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.listText}>{distraction}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Row 4: Reflection */}
      {hasReflection && (
        <View style={styles.reflectionRow}>
          <TouchableOpacity 
            style={styles.reflectionHeader} 
            onPress={handleReflectionToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Reflection</Text>
            {isReflectionExpanded ? (
              <ChevronUp size={16} color={COLORS.textSecondary} />
            ) : (
              <ChevronDown size={16} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>
          
          {isReflectionExpanded && (
            <View style={styles.reflectionContent}>
              <Text style={styles.reflectionText}>{scoreData.reflection}</Text>
              {(wakeUpTime || bedTime) && (
                <View style={styles.timeRow}>
                  {wakeUpTime && (
                    <Text style={styles.timeText}>Wake: {wakeUpTime}</Text>
                  )}
                  {bedTime && (
                    <Text style={styles.timeText}>Sleep: {bedTime}</Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    ...SHADOW.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  scores: {
    alignItems: 'flex-end',
  },
  scoreChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  difficultyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  achievementsRow: {
    marginBottom: 12,
  },
  distractionsRow: {
    marginBottom: 12,
  },
  reflectionRow: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  listContainer: {
    paddingLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPoint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
    lineHeight: 20,
  },
  listText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reflectionContent: {
    marginTop: 8,
  },
  reflectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
}); 