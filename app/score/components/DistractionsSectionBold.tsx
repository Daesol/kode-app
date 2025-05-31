import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Plus, X, AlertTriangle, Shield } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface DistractionsSectionBoldProps {
  distractions: string[];
  onDistractionsChange: (distractions: string[]) => void;
  isEditing?: boolean;
}

export default function DistractionsSectionBold({
  distractions,
  onDistractionsChange,
  isEditing = false,
}: DistractionsSectionBoldProps) {
  const [newDistraction, setNewDistraction] = useState('');

  const addDistraction = () => {
    if (newDistraction.trim()) {
      onDistractionsChange([...distractions, newDistraction.trim()]);
      setNewDistraction('');
    }
  };

  const removeDistraction = (index: number) => {
    const updatedDistractions = distractions.filter((_, i) => i !== index);
    onDistractionsChange(updatedDistractions);
  };

  const getMotivationalHeader = () => {
    if (distractions.length === 0) return "FORTRESS OF FOCUS";
    if (distractions.length <= 2) return "MINOR OBSTACLES";
    if (distractions.length <= 4) return "TESTING YOUR RESOLVE";
    return "BATTLEFIELD OF DISCIPLINE";
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AlertTriangle size={18} color={COLORS.error} />
        <Text style={styles.sectionTitle}>DISTRACTIONS</Text>
        <Shield size={18} color={COLORS.error} />
      </View>
      
      <Text style={[styles.motivationalHeader, { color: COLORS.error }]}>
        {getMotivationalHeader()}
      </Text>

      {!isEditing ? (
        <View style={styles.displayContainer}>
          {distractions.length > 0 ? (
            <FlatList
              data={distractions}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.distractionBadge}>
                  <View style={styles.distractionNumber}>
                    <Text style={styles.distractionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.distractionText}>{item}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No distractions logged.</Text>
              <Text style={styles.emptySubtext}>Focus is your superpower.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.editContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newDistraction}
              onChangeText={setNewDistraction}
              placeholder="What broke your focus today?"
              placeholderTextColor={COLORS.textSecondary}
              onSubmitEditing={addDistraction}
              returnKeyType="done"
            />
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={addDistraction}
              disabled={!newDistraction.trim()}
            >
              <Plus size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {distractions.length > 0 && (
            <FlatList
              data={distractions}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.editDistractionItem}>
                  <View style={styles.distractionNumber}>
                    <Text style={styles.distractionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.editDistractionText}>{item}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeDistraction(index)}
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
  distractionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderLeftWidth: 4,
  },
  distractionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  distractionNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  distractionText: {
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
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editDistractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 8,
  },
  editDistractionText: {
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