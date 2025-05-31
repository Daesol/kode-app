import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Edit } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface ReflectionSectionProps {
  reflection: string;
  onReflectionChange: (reflection: string) => void;
  isEditing?: boolean;
}

export default function ReflectionSection({
  reflection,
  onReflectionChange,
  isEditing = false,
}: ReflectionSectionProps) {
  const hasReflection = reflection.trim().length > 0;

  return (
    <View style={[styles.section, !isEditing && { marginBottom: 20 }]}>
      {isEditing ? (
        <View style={styles.inputWrapper}>
          <Edit size={16} color={COLORS.textSecondary} style={styles.placeholderIcon} />
          <TextInput
            style={styles.reflectionInput}
            value={reflection}
            onChangeText={onReflectionChange}
            placeholder="Jot down your private thoughts about today. Only you can see these."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Reflection (Private)</Text>
          {hasReflection ? (
            <Text style={styles.reflectionText}>{reflection}</Text>
          ) : (
            <Text style={styles.emptyText}>No reflection added</Text>
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
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 6,
    alignItems: 'flex-start',
  },
  placeholderIcon: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 4,
  },
  reflectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  reflectionInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 10,
    minHeight: 60,
    textAlignVertical: 'top',
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