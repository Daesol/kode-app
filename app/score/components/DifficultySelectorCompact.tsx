import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '@/constants/theme';

interface DifficultySelectorCompactProps {
  difficulty: number;
  onDifficultyChange: (difficulty: number) => void;
  isEditing?: boolean;
}

export default function DifficultySelectorCompact({
  difficulty,
  onDifficultyChange,
  isEditing = false,
}: DifficultySelectorCompactProps) {
  const getDifficultyData = (level: number) => {
    switch (level) {
      case 1: 
        return { 
          label: 'TRIVIAL', 
          message: 'Rest earned through struggle.',
          color: COLORS.scoreHigh,
        };
      case 2: 
        return { 
          label: 'LIGHT', 
          message: 'Building momentum requires patience.',
          color: COLORS.scoreMedium,
        };
      case 3: 
        return { 
          label: 'MODERATE', 
          message: 'Growth lives in the middle ground.',
          color: COLORS.scoreMediumLow,
        };
      case 4: 
        return { 
          label: 'INTENSE', 
          message: 'Greatness demands uncomfortable action.',
          color: COLORS.scoreLow,
        };
      case 5: 
        return { 
          label: 'BRUTAL', 
          message: 'Legends forged in fire of adversity.',
          color: '#8B0000',
        };
      default: 
        return { 
          label: 'MODERATE', 
          message: 'Growth lives in the middle ground.',
          color: COLORS.scoreMediumLow,
        };
    }
  };

  const currentData = getDifficultyData(difficulty);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>DIFFICULTY</Text>
      
      {!isEditing ? (
        <View style={styles.displayContainer}>
          <View style={[styles.difficultyBadge, { borderColor: currentData.color }]}>
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
          
          <View style={styles.selectedMessage}>
            <Text style={[styles.messageText, { color: currentData.color }]}>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },
  displayContainer: {
    alignItems: 'center',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    minWidth: '85%',
  },
  difficultyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  difficultyLevel: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  difficultyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  editContainer: {
    alignItems: 'center',
  },
  difficultyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
    width: '100%',
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
  },
  difficultyButtonActive: {
    backgroundColor: COLORS.backgroundDark,
    borderWidth: 2,
  },
  buttonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  buttonLevel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  buttonLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  selectedMessage: {
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    width: '90%',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
    fontStyle: 'italic',
  },
}); 