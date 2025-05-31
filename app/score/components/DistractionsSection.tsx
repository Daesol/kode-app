import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Plus, X, Circle, AlertTriangle } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface DistractionsSectionProps {
  distractions: string[];
  onDistractionsChange: (distractions: string[]) => void;
  isEditing?: boolean;
}

export default function DistractionsSection({
  distractions,
  onDistractionsChange,
  isEditing = false,
}: DistractionsSectionProps) {
  const [newDistraction, setNewDistraction] = useState('');

  const addDistraction = () => {
    if (newDistraction.trim()) {
      onDistractionsChange([...distractions, newDistraction.trim()]);
      setNewDistraction('');
    }
  };

  const removeDistraction = (index: number) => {
    onDistractionsChange(distractions.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.section}>
      {isEditing ? (
        <>
          <View style={styles.distractionInput}>
            <View style={styles.inputWrapper}>
              <AlertTriangle size={16} color={COLORS.textSecondary} style={styles.placeholderIcon} />
              <TextInput
                style={styles.distractionTextInput}
                value={newDistraction}
                onChangeText={setNewDistraction}
                placeholder="Add distractions that took your time away. Only you can see these."
                placeholderTextColor={COLORS.textSecondary}
                onSubmitEditing={addDistraction}
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addDistraction}
            >
              <Plus size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          {distractions.map((distraction, index) => (
            <View key={index} style={styles.distractionItem}>
              <Circle size={6} color={COLORS.error} style={styles.bulletPoint} />
              <Text style={styles.distractionText}>{distraction}</Text>
              <TouchableOpacity 
                onPress={() => removeDistraction(index)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Distractions</Text>
          {distractions.length > 0 ? (
            distractions.map((distraction, index) => (
              <View key={index} style={styles.distractionItem}>
                <Circle size={6} color={COLORS.error} style={styles.bulletPoint} />
                <Text style={styles.distractionText}>{distraction}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No distractions recorded</Text>
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
  distractionInput: {
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
  distractionTextInput: {
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
  distractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  bulletPoint: {
    marginRight: 8,
  },
  distractionText: {
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