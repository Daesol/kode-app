import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  useAnimatedRef,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

const KNOB_SIZE = 24;

interface ScoreSliderOriginalProps {
  score: number;
  onScoreChange: (score: number) => void;
  isEditing?: boolean;
}

export default function ScoreSliderOriginal({
  score,
  onScoreChange,
  isEditing = false,
}: ScoreSliderOriginalProps) {
  const { width } = useWindowDimensions();
  const SLIDER_WIDTH = width - 60; // Account for padding
  const translateX = useSharedValue(SLIDER_WIDTH * (score / 100));
  const sliderRef = useAnimatedRef<Reanimated.View>();
  const sliderLayout = useSharedValue({ x: 0, width: SLIDER_WIDTH });

  useEffect(() => {
    if (isEditing) {
      translateX.value = withSpring(SLIDER_WIDTH * (score / 100));
    }
  }, [isEditing, score, SLIDER_WIDTH]);

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue <= 25) return COLORS.scoreLow;
    if (scoreValue <= 50) return COLORS.scoreMediumLow;
    if (scoreValue <= 75) return COLORS.scoreMedium;
    return COLORS.scoreHigh;
  };

  const updateScore = (x: number) => {
    const newScore = Math.round((x / SLIDER_WIDTH) * 100);
    onScoreChange(Math.max(0, Math.min(100, newScore)));
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

  return (
    <View style={[styles.section, { marginBottom: 20 }]}>
      <Text style={styles.sectionTitle}>Effort Score</Text>
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
          {score}
        </Text>
        <Text style={styles.scoreMax}>/100</Text>
      </View>
      
      {isEditing && (
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
                { backgroundColor: getScoreColor(score) },
                fillStyle
              ]}
            />
          </Reanimated.View>

          <GestureDetector gesture={gesture}>
            <Reanimated.View 
              style={[
                styles.sliderKnob,
                { backgroundColor: getScoreColor(score) },
                knobStyle
              ]} 
            />
          </GestureDetector>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 