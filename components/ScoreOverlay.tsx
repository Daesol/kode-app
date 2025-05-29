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
  scoreData?: ScoreEntry;
  onClose: () => void;
  onEdit: () => void;
};

export default function ScoreOverlay({ date, scoreData, onClose, onEdit }: ScoreOverlayProps) {
  if (!scoreData) {
    return null;
  }

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
      <View style={styles.container}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
        )}
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.date}>{format(date, 'MMMM d, yyyy')}</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Effort Score</Text>
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreValue, { color: getScoreColor(scoreData.score) }]}>
                  {scoreData.score}
                </Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perceived Difficulty</Text>
              <Text style={styles.difficultyValue}>
                {getDifficultyLabel(scoreData.difficulty)}
              </Text>
            </View>

            {scoreData.reflection && scoreData.reflection.trim().length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reflection</Text>
                <Text style={styles.reflectionText}>{scoreData.reflection}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={onEdit}
            >
              <Edit3 size={20} color={COLORS.textPrimary} style={styles.editIcon} />
              <Text style={styles.editButtonText}>Edit Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  date: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: '70%',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
  },
  scoreMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    color: COLORS.textSecondary,
    marginLeft: 4,
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