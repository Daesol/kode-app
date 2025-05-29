import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useTrack } from '@/context/TrackContext';
import ScoreInput from '@/components/ScoreInput';

export default function EditScore() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { scores, addScore } = useTrack();
  
  const scoreData = scores[date];

  const handleSubmit = (data: { score: number; difficulty: number; reflection?: string }) => {
    addScore(data, new Date(date));
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScoreInput
        initialData={scoreData}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
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