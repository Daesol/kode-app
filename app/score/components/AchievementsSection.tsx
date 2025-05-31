import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Plus, X, Circle, Trophy } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface AchievementsSectionProps {
  achievements: string[];
  onAchievementsChange: (achievements: string[]) => void;
  isEditing?: boolean;
}

export default function AchievementsSection({
  achievements,
  onAchievementsChange,
  isEditing = false,
}: AchievementsSectionProps) {
  const [newAchievement, setNewAchievement] = useState('');

  const addAchievement = () => {
    if (newAchievement.trim()) {
      onAchievementsChange([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    onAchievementsChange(achievements.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.section}>
      {isEditing ? (
        <>
          <View style={styles.achievementInput}>
            <View style={styles.inputWrapper}>
              <Trophy size={16} color={COLORS.textSecondary} style={styles.placeholderIcon} />
              <TextInput
                style={styles.achievementTextInput}
                value={newAchievement}
                onChangeText={setNewAchievement}
                placeholder="Add achievements or tasks you finished."
                placeholderTextColor={COLORS.textSecondary}
                onSubmitEditing={addAchievement}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addAchievement}
            >
              <Plus size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Circle size={6} color={COLORS.primary} style={styles.bulletPoint} />
              <Text style={styles.achievementText}>{achievement}</Text>
              <TouchableOpacity 
                onPress={() => removeAchievement(index)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Circle size={6} color={COLORS.primary} style={styles.bulletPoint} />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No achievements recorded</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  achievementInput: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 6,
    marginRight: 8,
  },
  placeholderIcon: {
    marginLeft: 10,
    marginRight: 4,
  },
  achievementTextInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  bulletPoint: {
    marginRight: 8,
  },
  achievementText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
}); 