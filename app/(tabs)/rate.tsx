import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrack } from '@/context/TrackContext';
import ScoreInput from '@/components/ScoreInput';

export default function RateScreen() {
  const insets = useSafeAreaInsets();
  const { addScore } = useTrack();

  const handleScoreSubmit = (data: { score: number; difficulty: number; reflection?: string }) => {
    addScore(data);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScoreInput
        onSubmit={handleScoreSubmit}
        onCancel={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});