import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '@/constants/theme';

interface DifficultySelectorProps {
  difficulty: number;
  onDifficultyChange: (difficulty: number) => void;
  isEditing?: boolean;
}

export default function DifficultySelector({
  difficulty,
  onDifficultyChange,
  isEditing = false,
}: DifficultySelectorProps) {
  const getDifficultyData = (level: number) => {
    switch (level) {
      case 1: 
        return { 
          label: 'TRIVIAL', 
          message: 'Rest is earned through struggle.',
          color: COLORS.scoreHigh,
          icon: '⚪'
        };
      case 2: 
        return { 
          label: 'LIGHT', 
          message: 'Building momentum requires patience.',
          color: COLORS.scoreMedium,
          icon: '🟡'
        };
      case 3: 
        return { 
          label: 'MODERATE', 
          message: 'Growth lives in the middle ground.',
          color: COLORS.scoreMediumLow,
          icon: '🟠'
        };
      case 4: 
        return { 
          label: 'INTENSE', 
          message: 'Greatness demands uncomfortable action.',
          color: COLORS.scoreLow,
          icon: '🔴'
        };
      case 5: 
        return { 
          label: 'BRUTAL', 
          message: 'Legends are forged in the fire of adversity.',
          color: '#8B0000',
          icon: '⚫'
        };
      default: 
        return { 
          label: 'MODERATE', 
          message: 'Growth lives in the middle ground.',
          color: COLORS.scoreMediumLow,
          icon: '🟠'
        };
    }
  };

  const currentData = getDifficultyData(difficulty);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PERCEIVED DIFFICULTY</Text>
      
      {!isEditing ? (
        <View style={styles.displayContainer}>
          <View style={styles.difficultyDisplay}>
            <View style={[styles.difficultyIcon, { backgroundColor: currentData.color }]}>
              <Text style={styles.difficultyLevel}>{difficulty}</Text>
            </View>
            <View style={styles.difficultyInfo}>
              <Text style={[styles.difficultyLabel, { color: currentData.color }]}>
                {currentData.label}
              </Text>
              <Text style={styles.difficultyMessage}>
                {currentData.message}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.editContainer}>
          <View style={styles.difficultyGrid}>
            {[1, 2, 3, 4, 5].map((level) => {
              const data = getDifficultyData(level);
              const isSelected = difficulty === level;
              
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    isSelected && [styles.difficultyButtonActive, { borderColor: data.color }]
                  ]}
                  onPress={() => onDifficultyChange(level)}
                >
                  <View style={[
                    styles.buttonIcon,
                    { backgroundColor: isSelected ? data.color : COLORS.borderColor }
                  ]}>
                    <Text style={[
                      styles.buttonLevel,
                      { color: isSelected ? COLORS.textPrimary : COLORS.textSecondary }
                    ]}>
                      {level}
                    </Text>
                  </View>
                  <Text style={[
                    styles.buttonLabel,
                    { color: isSelected ? data.color : COLORS.textSecondary }
                  ]}>
                    {data.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View style={styles.selectedDisplay}>
            <Text style={styles.selectedLabel}>CURRENT SELECTION</Text>
            <Text style={[styles.selectedValue, { color: currentData.color }]}>
              {currentData.label}
            </Text>
            <Text style={styles.selectedMessage}>
              {currentData.message}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
  },
  displayContainer: {
    alignItems: 'center',
  },
  difficultyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    minWidth: '80%',
  },
  difficultyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  difficultyLevel: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 4,
  },
  difficultyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  editContainer: {
    alignItems: 'center',
  },
  difficultyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
    width: '100%',
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
  },
  difficultyButtonActive: {
    backgroundColor: COLORS.backgroundDark,
    borderWidth: 3,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonLevel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  buttonLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  selectedDisplay: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    width: '90%',
  },
  selectedLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  selectedValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: 6,
  },
  selectedMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
}); 