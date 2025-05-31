import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Plus, X, Trophy, Target } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface AchievementsSectionBoldProps {
  achievements: string[];
  onAchievementsChange: (achievements: string[]) => void;
  isEditing?: boolean;
}

export default function AchievementsSectionBold({
  achievements,
  onAchievementsChange,
  isEditing = false,
}: AchievementsSectionBoldProps) {
  const [newAchievement, setNewAchievement] = useState('');

  const addAchievement = () => {
    if (newAchievement.trim()) {
      onAchievementsChange([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    onAchievementsChange(updatedAchievements);
  };

  const getMotivationalHeader = () => {
    if (achievements.length === 0) return "CLAIM YOUR VICTORIES";
    if (achievements.length <= 2) return "BUILDING MOMENTUM";
    if (achievements.length <= 4) return "RISING WARRIOR";
    return "UNSTOPPABLE FORCE";
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Trophy size={18} color={COLORS.warning} />
        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        <Target size={18} color={COLORS.warning} />
      </View>
      
      <Text style={[styles.motivationalHeader, { color: COLORS.warning }]}>
        {getMotivationalHeader()}
      </Text>

      {!isEditing ? (
        <View style={styles.displayContainer}>
          {achievements.length > 0 ? (
            <FlatList
              data={achievements}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.achievementBadge}>
                  <View style={styles.achievementNumber}>
                    <Text style={styles.achievementNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.achievementText}>{item}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No victories recorded yet.</Text>
              <Text style={styles.emptySubtext}>Every champion starts here.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.editContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newAchievement}
              onChangeText={setNewAchievement}
              placeholder="What victory did you claim today?"
              placeholderTextColor={COLORS.textSecondary}
              onSubmitEditing={addAchievement}
              returnKeyType="done"
            />
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={addAchievement}
              disabled={!newAchievement.trim()}
            >
              <Plus size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {achievements.length > 0 && (
            <FlatList
              data={achievements}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.editAchievementItem}>
                  <View style={styles.achievementNumber}>
                    <Text style={styles.achievementNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.editAchievementText}>{item}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeAchievement(index)}
                  >
                    <X size={16} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginHorizontal: 8,
  },
  motivationalHeader: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  displayContainer: {
    minHeight: 60,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderLeftWidth: 4,
  },
  achievementNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  achievementText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  emptyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  editContainer: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButton: {
    backgroundColor: COLORS.warning,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAchievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 8,
  },
  editAchievementText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  removeButton: {
    padding: 4,
  },
}); 