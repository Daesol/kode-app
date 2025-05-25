import React, { useState, useEffect, useRef } from 'react';
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
import { COLORS, SHADOW } from '@/constants/theme';
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
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const HORIZONTAL_MARGIN = 20;
const SLIDER_WIDTH = Dimensions.get('window').width - 80 - (HORIZONTAL_MARGIN);
const KNOB_SIZE = 24;

type ScoreInputProps = {
  onSubmit: (data: { score: number; difficulty: number; reflection?: string }) => void;
  onCancel: () => void;
};

type Step = 'score' | 'difficulty' | 'reflection';

const ScoreInput: React.FC<ScoreInputProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState<Step>('score');
  const [score, setScore] = useState(50);
  const [difficulty, setDifficulty] = useState(3);
  const [reflection, setReflection] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));
  const translateX = useSharedValue(SLIDER_WIDTH * 0.5);
  const difficultyTranslateX = useSharedValue(SLIDER_WIDTH * 0.5);
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

  useEffect(() => {
    translateX.value = SLIDER_WIDTH * 0.5;
    updateScore(SLIDER_WIDTH * 0.5);
  }, []);

  const updateScore = (x: number) => {
    const newScore = Math.round((x / SLIDER_WIDTH) * 100);
    setScore(Math.max(0, Math.min(100, newScore)));
  };

  const updateDifficulty = (x: number) => {
    const newDifficulty = Math.round((x / SLIDER_WIDTH) * 4) + 1;
    setDifficulty(Math.max(1, Math.min(5, newDifficulty)));
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

  const difficultyGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      const currentX = difficultyTranslateX.value;
      difficultyTranslateX.value = currentX;
    })
    .onUpdate((e) => {
      'worklet';
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, e.absoluteX - sliderLayout.value.x));
      difficultyTranslateX.value = newX;
      runOnJS(updateDifficulty)(newX);
    })
    .onFinalize(() => {
      'worklet';
      const currentX = difficultyTranslateX.value;
      difficultyTranslateX.value = withSpring(currentX);
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const difficultyKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: difficultyTranslateX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  const difficultyFillStyle = useAnimatedStyle(() => ({
    width: difficultyTranslateX.value,
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
  
  const handleNext = () => {
    if (step === 'score') {
      setStep('difficulty');
    } else if (step === 'difficulty') {
      setStep('reflection');
    }
  };

  const handleBack = () => {
    if (step === 'difficulty') {
      setStep('score');
    } else if (step === 'reflection') {
      setStep('difficulty');
    }
  };
  
  const handleSubmit = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onSubmit({ score, difficulty, reflection });
    });
  };
  
  const getScoreColor = () => {
    if (score <= 25) return COLORS.scoreLow;
    if (score <= 50) return COLORS.scoreMediumLow;
    if (score <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  const getDifficultyColor = () => {
    if (difficulty <= 2) return COLORS.scoreHigh;
    if (difficulty === 3) return COLORS.scoreMedium;
    return COLORS.scoreLow;
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Moderate';
      case 4: return 'Hard';
      case 5: return 'Very Hard';
      default: return 'Moderate';
    }
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
      case 'score':
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

      case 'difficulty':
        return (
          <>
            <Text style={styles.modalTitle}>Perceived Difficulty</Text>
            <Text style={styles.modalSubtitle}>How easy or hard was today?</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={[styles.difficultyValue, { color: getDifficultyColor() }]}>
                {getDifficultyLabel()}
              </Text>
            </View>
            
            <View style={styles.sliderContainer}>
              <Reanimated.View 
                ref={sliderRef}
                style={[styles.sliderTrack, { marginHorizontal: HORIZONTAL_MARGIN }]}
              >
                <Reanimated.View 
                  style={[
                    styles.sliderFill,
                    { backgroundColor: getDifficultyColor() },
                    difficultyFillStyle
                  ]}
                />
              </Reanimated.View>

              <GestureDetector gesture={difficultyGesture}>
                <Reanimated.View 
                  style={[
                    styles.sliderKnob,
                    { backgroundColor: getDifficultyColor(), marginLeft: HORIZONTAL_MARGIN },
                    difficultyKnobStyle
                  ]} 
                />
              </GestureDetector>
              
              <View style={[styles.sliderMarkers, { marginHorizontal: HORIZONTAL_MARGIN }]}>
                {['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'].map((label, index) => (
                  <View key={label} style={styles.markerContainer}>
                    <View 
                      style={[
                        styles.marker,
                        difficulty > index && { backgroundColor: getDifficultyColor() }
                      ]} 
                    />
                    <Text style={styles.markerLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        );

      case 'reflection':
        return (
          <>
            <Text style={styles.modalTitle}>Quick Reflection</Text>
            <Text style={styles.modalSubtitle}>Add a note to future you... (optional)</Text>
            
            <TextInput
              style={styles.reflectionInput}
              placeholder="What made today special?"
              placeholderTextColor={COLORS.textSecondary}
              value={reflection}
              onChangeText={setReflection}
              multiline
              maxLength={280}
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
          {step !== 'score' && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <ChevronLeft size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          
          {renderStepContent()}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={step === 'reflection' ? handleSubmit : handleNext}
            >
              <Text style={styles.submitButtonText}>
                {step === 'reflection' ? 'Save' : 'Next'}
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
    ...SHADOW.medium,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 1,
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
  difficultyValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: COLORS.primary,
    textAlign: 'center',
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
    ...SHADOW.medium,
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
  reflectionInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    height: 120,
    color: COLORS.textPrimary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 24,
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
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
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