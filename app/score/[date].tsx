import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { format } from 'date-fns';
import { CreditCard as Edit3, ArrowLeft, X, Check, Plus, Minus, Circle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrack } from '@/context/TrackContext';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  useAnimatedRef,
  measure,
} from 'react-native-reanimated';

const KNOB_SIZE = 24;
const HORIZONTAL_MARGIN = 0;

export default function ScoreDetailsScreen() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { getScoreForDate, addScore } = useTrack();
  
  const scoreDate = new Date(date as string);
  const scoreData = getScoreForDate(scoreDate);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(scoreData?.score || 50);
  const [editedDifficulty, setEditedDifficulty] = useState(scoreData?.difficulty || 3);
  const [editedReflection, setEditedReflection] = useState(scoreData?.reflection || '');
  const [editedAchievements, setEditedAchievements] = useState<string[]>(
    scoreData?.achievements || []
  );
  const [newAchievement, setNewAchievement] = useState('');

  const SLIDER_WIDTH = width - 60; // Account for padding
  const translateX = useSharedValue(SLIDER_WIDTH * (editedScore / 100));
  const sliderRef = useAnimatedRef<Reanimated.View>();
  const sliderLayout = useSharedValue({ x: 0, width: SLIDER_WIDTH });

  useEffect(() => {
    if (isEditing) {
      translateX.value = withSpring(SLIDER_WIDTH * (editedScore / 100));
    }
  }, [isEditing, SLIDER_WIDTH]);

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

  const handleSave = () => {
    addScore({
      score: editedScore,
      difficulty: editedDifficulty,
      reflection: editedReflection.trim(),
      achievements: editedAchievements.filter(a => a.trim() !== ''),
    }, scoreDate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScore(scoreData.score);
    setEditedDifficulty(scoreData.difficulty);
    setEditedReflection(scoreData.reflection || '');
    setEditedAchievements(scoreData.achievements || []);
    translateX.value = withSpring(SLIDER_WIDTH * (scoreData.score / 100));
    setIsEditing(false);
  };

  const updateScore = (x: number) => {
    const newScore = Math.round((x / SLIDER_WIDTH) * 100);
    setEditedScore(Math.max(0, Math.min(100, newScore)));
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      const currentX = translateX.value;
      translateX.value = currentX;
    })
    .onUpdate((e) => {
      'worklet';
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, e.absoluteX - sliderLayout.value.x));
      translateX.value = newX;
      runOnJS(updateScore)(newX);
    })
    .onFinalize(() => {
      'worklet';
      const currentX = translateX.value;
      translateX.value = withSpring(currentX);
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setEditedAchievements([...editedAchievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setEditedAchievements(editedAchievements.filter((_, i) => i !== index));
  };

  const hasReflection = isEditing ? editedReflection.trim().length > 0 : scoreData.reflection && scoreData.reflection.trim().length > 0;
  const hasAchievements = isEditing ? editedAchievements.length > 0 : scoreData.achievements && scoreData.achievements.length > 0;

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.date}>{format(scoreDate, 'MMMM d, yyyy')}</Text>
          {isEditing ? (
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {isEditing ? (
              <>
                {/* Edit Mode Layout: Achievements, Reflection, Difficulty, Score */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Achievements</Text>
                  <View style={styles.achievementInput}>
                    <TextInput
                      style={styles.achievementTextInput}
                      value={newAchievement}
                      onChangeText={setNewAchievement}
                      placeholder="Add an achievement..."
                      placeholderTextColor={COLORS.textSecondary}
                      onSubmitEditing={addAchievement}
                      returnKeyType="done"
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={addAchievement}
                    >
                      <Plus size={18} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                  </View>
                  {editedAchievements.map((achievement, index) => (
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
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Reflection</Text>
                  <TextInput
                    style={styles.reflectionInput}
                    value={editedReflection}
                    onChangeText={setEditedReflection}
                    placeholder="Add your thoughts about today..."
                    placeholderTextColor={COLORS.textSecondary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Perceived Difficulty</Text>
                  <View style={styles.difficultyButtons}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.difficultyButton,
                          editedDifficulty === level && styles.difficultyButtonActive
                        ]}
                        onPress={() => setEditedDifficulty(level)}
                      >
                        <Text style={[
                          styles.difficultyButtonText,
                          editedDifficulty === level && styles.difficultyButtonTextActive
                        ]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.difficultyLabel}>
                    {getDifficultyLabel(editedDifficulty)}
                  </Text>
                </View>

                <View style={[styles.section, { marginBottom: 20 }]}>
                  <Text style={styles.sectionTitle}>Effort Score</Text>
                  <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(editedScore) }]}>
                      {editedScore}
                    </Text>
                    <Text style={styles.scoreMax}>/100</Text>
                  </View>
                  
                  <View style={styles.sliderContainer}>
                    <Reanimated.View 
                      ref={sliderRef}
                      style={styles.sliderTrack}
                      onLayout={(event) => {
                        const { x, width } = event.nativeEvent.layout;
                        sliderLayout.value = { x, width };
                      }}
                    >
                      <Reanimated.View 
                        style={[
                          styles.sliderFill,
                          { backgroundColor: getScoreColor(editedScore) },
                          fillStyle
                        ]}
                      />
                    </Reanimated.View>

                    <GestureDetector gesture={gesture}>
                      <Reanimated.View 
                        style={[
                          styles.sliderKnob,
                          { backgroundColor: getScoreColor(editedScore) },
                          knobStyle
                        ]} 
                      />
                    </GestureDetector>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Display Mode Layout: Score, Difficulty, Achievements, Reflection */}
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

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Achievements</Text>
                  {hasAchievements ? (
                    scoreData.achievements?.map((achievement, index) => (
                      <View key={index} style={styles.achievementItem}>
                        <Circle size={6} color={COLORS.primary} style={styles.bulletPoint} />
                        <Text style={styles.achievementText}>{achievement}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No achievements recorded</Text>
                  )}
                </View>

                <View style={[styles.section, { marginBottom: 20 }]}>
                  <Text style={styles.sectionTitle}>Reflection</Text>
                  {hasReflection ? (
                    <Text style={styles.reflectionText}>{scoreData.reflection}</Text>
                  ) : (
                    <Text style={styles.emptyText}>No reflection added</Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          {isEditing ? (
            <TouchableOpacity 
              style={[styles.editButton, styles.saveButton]} 
              onPress={handleSave}
            >
              <Check size={18} color={COLORS.textPrimary} style={styles.editIcon} />
              <Text style={styles.editButtonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Edit3 size={18} color={COLORS.textPrimary} style={styles.editIcon} />
              <Text style={styles.editButtonText}>Edit Entry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  backButton: {
    padding: 4,
  },
  cancelButton: {
    padding: 4,
  },
  date: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
  },
  scoreMax: {
    fontFamily: 'Inter-Regular',
    fontSize: 20,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  sliderContainer: {
    marginBottom: 8,
    height: 50,
    position: 'relative',
    paddingHorizontal: 14,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: COLORS.borderColor,
    borderRadius: 3,
    marginBottom: 20,
    marginTop: 8,
    overflow: 'visible',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  sliderKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: -(KNOB_SIZE - 22) / 2,
    left: 14 - KNOB_SIZE / 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  difficultyValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  difficultyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  difficultyButtonTextActive: {
    color: COLORS.textPrimary,
  },
  difficultyLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  achievementInput: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  achievementTextInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
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
  reflectionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  reflectionInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: COLORS.success,
  },
  editIcon: {
    marginRight: 6,
  },
  editButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
}); 