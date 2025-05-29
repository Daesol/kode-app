import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform,
  ScrollView 
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { format } from 'date-fns';
import { CreditCard as Edit3, X } from 'lucide-react-native';

type ScoreEntry = {
  score: number;
  difficulty: number;
  reflection?: string;
};

type ScoreOverlayProps = {
  date: Date;
  scoreData: ScoreEntry;
  onClose: () => void;
  onEdit: () => void;
};

export default function ScoreOverlay({ date, scoreData, onClose, onEdit }: ScoreOverlayProps) {
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
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
        )}
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.date}>{format(date, 'MMMM d, yyyy')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
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
          </ScrollView>

          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Edit3 size={20} color={COLORS.textPrimary} style={styles.editIcon} />
            <Text style={styles.editButtonText}>Edit Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 0,
  },
  date: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
    marginTop: 24,
  },
  scrollContentContainer: {
    padding: 24,
    paddingTop: 0,
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
    margin: 24,
    marginTop: 0,
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