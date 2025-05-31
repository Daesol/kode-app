import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Book, Eye, Lightbulb } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface ReflectionSectionBoldProps {
  reflection: string;
  onReflectionChange: (reflection: string) => void;
  isEditing?: boolean;
}

export default function ReflectionSectionBold({
  reflection,
  onReflectionChange,
  isEditing = false,
}: ReflectionSectionBoldProps) {
  const getMotivationalHeader = () => {
    if (!reflection.trim()) return "GATHER WISDOM";
    if (reflection.length <= 50) return "SEEDS OF INSIGHT";
    if (reflection.length <= 150) return "DEEP CONTEMPLATION";
    return "PHILOSOPHER'S MIND";
  };

  const getWisdomPrompt = () => {
    const prompts = [
      "What truth did today reveal?",
      "How did you grow stronger?",
      "What lesson will you carry forward?",
      "Where did you find your power?",
      "What would you tell yesterday's self?",
    ];
    
    // Simple deterministic selection based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return prompts[dayOfYear % prompts.length];
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Book size={18} color={COLORS.secondary} />
        <Text style={styles.sectionTitle}>REFLECTION</Text>
        <Text style={styles.privateLabel}>(PRIVATE)</Text>
        <Lightbulb size={18} color={COLORS.secondary} />
      </View>
      
      <Text style={[styles.motivationalHeader, { color: COLORS.secondary }]}>
        {getMotivationalHeader()}
      </Text>

      {!isEditing ? (
        <View style={styles.displayContainer}>
          {reflection.trim() ? (
            <View style={styles.reflectionCard}>
              <View style={styles.reflectionIcon}>
                <Eye size={20} color={COLORS.secondary} />
              </View>
              <Text style={styles.reflectionText}>{reflection}</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No reflection recorded.</Text>
              <Text style={styles.emptySubtext}>Wisdom awaits your thoughts.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.editContainer}>
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{getWisdomPrompt()}</Text>
          </View>
          
          <TextInput
            style={styles.textArea}
            value={reflection}
            onChangeText={onReflectionChange}
            placeholder="What insights did today bring? Share your thoughts..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {reflection.length} characters
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
  privateLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    opacity: 0.7,
  },
  motivationalHeader: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  displayContainer: {
    minHeight: 80,
  },
  reflectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderLeftWidth: 6,
  },
  reflectionIcon: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 20,
    padding: 8,
  },
  reflectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 16,
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
  promptContainer: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  promptText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    alignItems: 'flex-end',
  },
  characterCountText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
  },
}); 