import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SHADOW } from '@/constants/theme';

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          {icon}
        </View>
        
        <Text style={styles.title}>{title}</Text>
        
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    ...SHADOW.small,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLORS.primary,
    textAlign: 'center',
  },
});