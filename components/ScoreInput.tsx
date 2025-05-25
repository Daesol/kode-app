import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  Dimensions,
  TextInput
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  measure,
  useAnimatedRef
} from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

const HORIZONTAL_MARGIN = 20;
const SLIDER_WIDTH = Dimensions.get('window').width - 80 - (HORIZONTAL_MARGIN);
const KNOB_SIZE = 24;

type RatingData = {
  score: number;
  difficulty: number;
  reflection?: string;
}

type ScoreInputProps = {
  onSubmit: (data: RatingData) => void;
  onCancel: () => void;
};

const DIFFICULTY_LABELS = [
  { value: 1, label: 'Very Easy', description: 'I felt focused and motivated' },
  { value: 2, label: 'Easy', description: 'Tasks flowed naturally' },
  { value: 3, label: 'Moderate', description: 'Required some effort' },
  { value: 4, label: 'Hard', description: 'Faced some challenges' },
  { value: 5, label: 'Very Hard', description: 'Struggled emotionally or mentally' }
];

const ScoreInput: React.FC<ScoreInputProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(50);
  const [difficulty, setDifficulty] = useState(3);
  const [reflection, setReflection] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));
  const translateX = useSharedValue(SLIDER_WIDTH * 0.5);
  const sliderRef = useAnimatedRef<Reanimated.View>();
  const sliderMeasured = useSharedValue(false);
  const sliderLayout = useSharedValue({ x: 0, width: SLIDER_WIDTH });

  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current) {
        const measurements = measure(sliderRef);
        if (measurements) {
          sliderLayout.value = { 
            x: measurements.pageX, 
            width: measurements.width 
          };
          sliderMeasured.value = true;
        }
      }
    }, 100);
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateScore = (x: number) => {
    const newScore = Math.round((x / SLIDER_WIDTH) * 100);
    setScore(Math.max(0, Math.min(100, newScore)));
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

  const handleClose = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onCancel();
    });
  };
  
  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onSubmit({ score, difficulty, reflection });
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      handleClose();
    }
  };
  
  const getScoreColor = () => {
    if (score <= 25) return COLORS.scoreLow;
    if (score <= 50) return COLORS.scoreMediumLow;
    if (score <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };
  
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });
  
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.modalTitle}>Rate Today's Effort</Text>
            <Text style={styles.modalSubtitle}>How much effort did you put in today?</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
                {score}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            
            <View style={styles.sliderContainer}>
              <Reanimated.View 
                ref={sliderRef}
                style={[styles.sliderTrack, { marginHorizontal: HORIZONTAL_MARGIN }]}
              >
                <Reanimated.View 
                  style={[
                    styles.sliderFill,
                    { backgroundColor: getScoreColor() },
                    fillStyle
                  ]}
                />
              </Reanimated.View>

              <GestureDetector gesture={gesture}>
                <Reanimated.View 
                  style={[
                    styles.sliderKnob,
                    { backgroundColor: getScoreColor(), marginLeft: HORIZONTAL_MARGIN },
                    knobStyle
                  ]} 
                />
              </GestureDetector>
              
              <View style={[styles.sliderMarkers, { marginHorizontal: HORIZONTAL_MARGIN }]}>
                {[0, 25, 50, 75, 100].map(value => (
                  <View key={value} style={styles.markerContainer}>
                    <View 
                      style={[
                        styles.marker,
                        score >= value && { backgroundColor: getScoreColor() }
                      ]} 
                    />
                    <Text style={styles.markerLabel}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.modalTitle}>How easy or hard was today?</Text>
            <Text style={styles.modalSubtitle}>Select the level that best describes your day</Text>
            
            <View style={styles.difficultyContainer}>
              {DIFFICULTY_LABELS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.difficultyOption,
                    difficulty === item.value && styles.difficultyOptionSelected
                  ]}
                  onPress={() => setDifficulty(item.value)}
                >
                  <Text style={[
                    styles.difficultyLabel,
                    difficulty === item.value && styles.difficultyLabelSelected
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.difficultyDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.modalTitle}>Add a Quick Note</Text>
            <Text style={styles.modalSubtitle}>Optional: Leave a message for future you...</Text>
            
            <TextInput
              style={styles.reflectionInput}
              placeholder="What's on your mind? (optional)"
              placeholderTextColor={COLORS.textSecondary}
              value={reflection}
              onChangeText={setReflection}
              multiline
              maxLength={500}
            />
          </>
        );
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
    >
      <GestureHandlerRootView style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
        )}
        
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY }], opacity }
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ChevronLeft size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={styles.stepIndicator}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.stepDot,
                    i === step && styles.stepDotActive
                  ]}
                />
              ))}
            </View>
            <View style={styles.backButton} />
          </View>

          {renderStepContent()}
          
          <View style={styles.buttonRow}>
            {step === 3 && (
              <TouchableOpacity 
                style={[styles.button, styles.skipButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton, step === 3 && styles.submitButtonWide]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {step === 3 ? 'Save' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderColor,
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
    color: COLORS.primary,
  },
  scoreMax: {
    fontFamily: 'Inter-Medium',
    fontSize: 24,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  sliderContainer: {
    marginBottom: 32,
    height: 80,
    position: 'relative',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: COLORS.borderColor,
    borderRadius: 4,
    marginBottom: 24,
    marginTop: 10,
    overflow: 'visible',
  },
  sliderFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  sliderKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: -(KNOB_SIZE-24) / 2,
    left: -KNOB_SIZE / 2,
    pointerEvents: 'auto',
  },
  sliderMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 4,
    height: 12,
    backgroundColor: COLORS.borderColor,
    borderRadius: 2,
    marginBottom: 4,
  },
  markerLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  difficultyContainer: {
    marginBottom: 24,
  },
  difficultyOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  difficultyOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
  },
  difficultyLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  difficultyLabelSelected: {
    color: COLORS.primary,
  },
  difficultyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  reflectionInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flex: 2,
  },
  submitButtonWide: {
    flex: 1,
  },
  skipButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});

export default ScoreInput;