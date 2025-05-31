import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '@/constants/theme';

interface DifficultySelectorOriginalProps {
  difficulty: number;
  onDifficultyChange: (difficulty: number) => void;
  isEditing?: boolean;
}

export default function DifficultySelectorOriginal({
  difficulty,
  onDifficultyChange,
  isEditing = false,
}: DifficultySelectorOriginalProps) {
  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Moderate';
      case 4: return 'Hard';
      case 5: return 'Very Hard';
      default: return 'Moderate';
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Perceived Difficulty</Text>
      {isEditing ? (
        <>
          <View style={styles.difficultyButtons}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive
                ]}
                onPress={() => onDifficultyChange(level)}
              >
                <Text style={[
                  styles.difficultyButtonText,
                  difficulty === level && styles.difficultyButtonTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.difficultyLabel}>
            {getDifficultyLabel(difficulty)}
          </Text>
        </>
      ) : (
        <Text style={styles.difficultyValue}>
          {getDifficultyLabel(difficulty)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  difficultyValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  difficultyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  difficultyButtonTextActive: {
    color: COLORS.textPrimary,
  },
  difficultyLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
}); 