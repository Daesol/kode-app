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
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import Svg, { Circle } from 'react-native-svg';

const KNOB_SIZE = 32;
const CIRCLE_SIZE = 240;
const CIRCLE_RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

interface ScoreSliderProps {
  score: number;
  onScoreChange: (score: number) => void;
  isEditing?: boolean;
}

export default function ScoreSlider({
  score,
  onScoreChange,
  isEditing = false,
}: ScoreSliderProps) {
  const { width } = useWindowDimensions();
  const SLIDER_WIDTH = width - 80; // Account for padding
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

  const getScoreMessage = (scoreValue: number) => {
    if (scoreValue <= 20) return "REBUILD";
    if (scoreValue <= 40) return "RISE";
    if (scoreValue <= 60) return "FORGE";
    if (scoreValue <= 80) return "CONQUER";
    return "DOMINATE";
  };

  const getScoreSubtext = (scoreValue: number) => {
    if (scoreValue <= 20) return "Every warrior falls. The strong rise again.";
    if (scoreValue <= 40) return "Progress demands persistence through pain.";
    if (scoreValue <= 60) return "Discipline shapes destiny. Keep forging.";
    if (scoreValue <= 80) return "Excellence is earned through effort.";
    return "Mastery achieved. Sustain the momentum.";
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
    backgroundColor: interpolateColor(
      translateX.value / SLIDER_WIDTH,
      [0, 0.25, 0.5, 0.75, 1],
      [COLORS.scoreLow, COLORS.scoreMediumLow, COLORS.scoreMedium, COLORS.scoreHigh, COLORS.scoreHigh]
    ),
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
    backgroundColor: interpolateColor(
      translateX.value / SLIDER_WIDTH,
      [0, 0.25, 0.5, 0.75, 1],
      [COLORS.scoreLow, COLORS.scoreMediumLow, COLORS.scoreMedium, COLORS.scoreHigh, COLORS.scoreHigh]
    ),
  }));

  const strokeDashoffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <View style={styles.section}>
      <View style={styles.heroContainer}>
        {/* Circular Progress */}
        <View style={styles.circularProgress}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svgContainer}>
            {/* Background circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke={COLORS.borderColor}
              strokeWidth={4}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke={getScoreColor(score)}
              strokeWidth={6}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>
          
          {/* Central Score Display */}
          <View style={styles.scoreCenter}>
            <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>EFFORT</Text>
            <Text style={[styles.scoreMessage, { color: getScoreColor(score) }]}>
              {getScoreMessage(score)}
            </Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {getScoreSubtext(score)}
          </Text>
        </View>
      </View>
      
      {isEditing && (
        <View style={styles.editSection}>
          <Text style={styles.editLabel}>ADJUST YOUR EFFORT</Text>
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
                style={[styles.sliderFill, fillStyle]}
              />
            </Reanimated.View>

            <GestureDetector gesture={gesture}>
              <Reanimated.View 
                style={[styles.sliderKnob, knobStyle]} 
              />
            </GestureDetector>
          </View>
          
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>WEAK</Text>
            <Text style={styles.scaleLabel}>MODERATE</Text>
            <Text style={styles.scaleLabel}>ELITE</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
    alignItems: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circularProgress: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  svgContainer: {
    transform: [{ rotate: '0deg' }],
  },
  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -2,
  },
  scoreLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 4,
    marginTop: -4,
    marginBottom: 8,
  },
  scoreMessage: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    letterSpacing: 2,
    textAlign: 'center',
  },
  messageContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  editSection: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  editLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    height: 60,
    position: 'relative',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: COLORS.borderColor,
    borderRadius: 4,
    overflow: 'visible',
  },
  sliderFill: {
    height: 8,
    borderRadius: 4,
  },
  sliderKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    position: 'absolute',
    top: (60 - KNOB_SIZE) / 2,
    left: 20 - KNOB_SIZE / 2,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.backgroundDark,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  scaleLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
}); 