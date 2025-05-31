import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { format } from 'date-fns';
import { CreditCard as Edit3, ArrowLeft, X, Check, Layers, Zap } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrack } from '@/context/TrackContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  TimeEntry,
  TimeDisplay,
  TimeDisplayOriginal,
  AchievementsSection,
  DistractionsSection,
  ReflectionSection,
  DifficultySelector,
  DifficultySelectorOriginal,
  ScoreSlider,
  ScoreSliderOriginal,
} from './components';

type TabType = 'clean' | 'bold';

export default function ScoreDetailsScreen() {
  const { date } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getScoreForDate, addScore } = useTrack();
  
  const scoreDate = new Date(date as string);
  const scoreData = getScoreForDate(scoreDate);
  
  const [activeTab, setActiveTab] = useState<TabType>('clean');
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(scoreData?.score || 50);
  const [editedDifficulty, setEditedDifficulty] = useState(scoreData?.difficulty || 3);
  const [editedReflection, setEditedReflection] = useState(scoreData?.reflection || '');
  const [editedAchievements, setEditedAchievements] = useState<string[]>(
    scoreData?.achievements || []
  );
  const [editedDistractions, setEditedDistractions] = useState<string[]>(
    scoreData?.distractions || []
  );
  
  // State for wake up time and bedtime
  const [wakeUpHour, setWakeUpHour] = useState(scoreData?.wakeUpHour || '');
  const [wakeUpMinute, setWakeUpMinute] = useState(scoreData?.wakeUpMinute || '');
  const [wakeUpPeriod, setWakeUpPeriod] = useState<'AM' | 'PM'>(scoreData?.wakeUpPeriod || 'AM');
  const [bedtimeHour, setBedtimeHour] = useState(scoreData?.bedtimeHour || '');
  const [bedtimeMinute, setBedtimeMinute] = useState(scoreData?.bedtimeMinute || '');
  const [bedtimePeriod, setBedtimePeriod] = useState<'AM' | 'PM'>(scoreData?.bedtimePeriod || 'PM');

  // Validation states
  const [isWakeUpTimeValid, setIsWakeUpTimeValid] = useState(true);
  const [isBedtimeValid, setIsBedtimeValid] = useState(true);

  if (!scoreData) {
    return null;
  }

  const handleSave = () => {
    // Check if times are valid before saving
    if (!isWakeUpTimeValid || !isBedtimeValid) {
      // Don't save if times are invalid
      return;
    }

    addScore({
      score: editedScore,
      difficulty: editedDifficulty,
      reflection: editedReflection.trim(),
      achievements: editedAchievements.filter(a => a.trim() !== ''),
      distractions: editedDistractions.filter(d => d.trim() !== ''),
      wakeUpHour,
      wakeUpMinute,
      wakeUpPeriod,
      bedtimeHour,
      bedtimeMinute,
      bedtimePeriod,
    }, scoreDate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScore(scoreData.score);
    setEditedDifficulty(scoreData.difficulty);
    setEditedReflection(scoreData.reflection || '');
    setEditedAchievements(scoreData.achievements || []);
    setEditedDistractions(scoreData.distractions || []);
    setWakeUpHour(scoreData.wakeUpHour || '');
    setWakeUpMinute(scoreData.wakeUpMinute || '');
    setWakeUpPeriod(scoreData.wakeUpPeriod || 'AM');
    setBedtimeHour(scoreData.bedtimeHour || '');
    setBedtimeMinute(scoreData.bedtimeMinute || '');
    setBedtimePeriod(scoreData.bedtimePeriod || 'PM');
    setIsEditing(false);
  };

  const renderCleanLayout = () => {
    return isEditing ? (
      <>
        {/* Edit Mode Layout - Clean */}
        <View style={styles.timeRow}>
          <TimeEntry
            label="Wake Up Time"
            hour={wakeUpHour}
            minute={wakeUpMinute}
            period={wakeUpPeriod}
            onHourChange={setWakeUpHour}
            onMinuteChange={setWakeUpMinute}
            onPeriodChange={setWakeUpPeriod}
            onValidationChange={setIsWakeUpTimeValid}
          />
          <TimeEntry
            label="Bedtime"
            hour={bedtimeHour}
            minute={bedtimeMinute}
            period={bedtimePeriod}
            onHourChange={setBedtimeHour}
            onMinuteChange={setBedtimeMinute}
            onPeriodChange={setBedtimePeriod}
            onValidationChange={setIsBedtimeValid}
          />
        </View>

        <AchievementsSection
          achievements={editedAchievements}
          onAchievementsChange={setEditedAchievements}
          isEditing={true}
        />

        <DistractionsSection
          distractions={editedDistractions}
          onDistractionsChange={setEditedDistractions}
          isEditing={true}
        />

        <ReflectionSection
          reflection={editedReflection}
          onReflectionChange={setEditedReflection}
          isEditing={true}
        />

        <DifficultySelectorOriginal
          difficulty={editedDifficulty}
          onDifficultyChange={setEditedDifficulty}
          isEditing={true}
        />

        <ScoreSliderOriginal
          score={editedScore}
          onScoreChange={setEditedScore}
          isEditing={true}
        />
      </>
    ) : (
      <>
        {/* Display Mode Layout - Clean */}
        <TimeDisplayOriginal scoreData={scoreData} />

        <AchievementsSection
          achievements={scoreData.achievements || []}
          onAchievementsChange={() => {}}
          isEditing={false}
        />

        <DistractionsSection
          distractions={scoreData.distractions || []}
          onDistractionsChange={() => {}}
          isEditing={false}
        />

        <ReflectionSection
          reflection={scoreData.reflection || ''}
          onReflectionChange={() => {}}
          isEditing={false}
        />

        <DifficultySelectorOriginal
          difficulty={scoreData.difficulty}
          onDifficultyChange={() => {}}
          isEditing={false}
        />

        <ScoreSliderOriginal
          score={scoreData.score}
          onScoreChange={() => {}}
          isEditing={false}
        />
      </>
    );
  };

  const renderBoldLayout = () => {
    return isEditing ? (
      <>
        {/* Edit Mode Layout - Bold */}
        <View style={styles.timeRow}>
          <TimeEntry
            label="Wake Up Time"
            hour={wakeUpHour}
            minute={wakeUpMinute}
            period={wakeUpPeriod}
            onHourChange={setWakeUpHour}
            onMinuteChange={setWakeUpMinute}
            onPeriodChange={setWakeUpPeriod}
            onValidationChange={setIsWakeUpTimeValid}
          />
          <TimeEntry
            label="Bedtime"
            hour={bedtimeHour}
            minute={bedtimeMinute}
            period={bedtimePeriod}
            onHourChange={setBedtimeHour}
            onMinuteChange={setBedtimeMinute}
            onPeriodChange={setBedtimePeriod}
            onValidationChange={setIsBedtimeValid}
          />
        </View>

        <AchievementsSection
          achievements={editedAchievements}
          onAchievementsChange={setEditedAchievements}
          isEditing={true}
        />

        <DistractionsSection
          distractions={editedDistractions}
          onDistractionsChange={setEditedDistractions}
          isEditing={true}
        />

        <ReflectionSection
          reflection={editedReflection}
          onReflectionChange={setEditedReflection}
          isEditing={true}
        />

        <DifficultySelector
          difficulty={editedDifficulty}
          onDifficultyChange={setEditedDifficulty}
          isEditing={true}
        />

        <ScoreSlider
          score={editedScore}
          onScoreChange={setEditedScore}
          isEditing={true}
        />
      </>
    ) : (
      <>
        {/* Display Mode Layout - Bold */}
        <ScoreSlider
          score={scoreData.score}
          onScoreChange={() => {}}
          isEditing={false}
        />

        <DifficultySelector
          difficulty={scoreData.difficulty}
          onDifficultyChange={() => {}}
          isEditing={false}
        />

        <TimeDisplay scoreData={scoreData} />

        <AchievementsSection
          achievements={scoreData.achievements || []}
          onAchievementsChange={() => {}}
          isEditing={false}
        />

        <DistractionsSection
          distractions={scoreData.distractions || []}
          onDistractionsChange={() => {}}
          isEditing={false}
        />

        <ReflectionSection
          reflection={scoreData.reflection || ''}
          onReflectionChange={() => {}}
          isEditing={false}
        />
      </>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>
              {activeTab === 'clean' ? 'CLEAN ENTRY' : 'BOLD ENTRY'}
            </Text>
            <Text style={styles.date}>{format(scoreDate, 'MMM d, yyyy').toUpperCase()}</Text>
          </View>
          {isEditing ? (
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'clean' && styles.activeTab]}
            onPress={() => setActiveTab('clean')}
          >
            <Layers size={18} color={activeTab === 'clean' ? COLORS.textPrimary : COLORS.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'clean' && styles.activeTabText]}>
              Clean
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'bold' && styles.activeTab]}
            onPress={() => setActiveTab('bold')}
          >
            <Zap size={18} color={activeTab === 'bold' ? COLORS.textPrimary : COLORS.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'bold' && styles.activeTabText]}>
              Bold
            </Text>
          </TouchableOpacity>
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
            {activeTab === 'clean' ? renderCleanLayout() : renderBoldLayout()}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          {isEditing ? (
            <TouchableOpacity 
              style={[
                styles.editButton, 
                styles.saveButton,
                (!isWakeUpTimeValid || !isBedtimeValid) && styles.disabledButton
              ]} 
              onPress={handleSave}
              disabled={!isWakeUpTimeValid || !isBedtimeValid}
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
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  date: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    letterSpacing: 1,
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: COLORS.borderColor,
    backgroundColor: COLORS.backgroundDark,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  saveButton: {
    backgroundColor: COLORS.success,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  disabledButton: {
    backgroundColor: COLORS.textDisabled,
    opacity: 0.6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundDark,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
}); 