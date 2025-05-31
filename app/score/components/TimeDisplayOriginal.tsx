import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { ScoreEntry } from '@/context/TrackContext';

interface TimeDisplayOriginalProps {
  scoreData: ScoreEntry;
}

export default function TimeDisplayOriginal({ scoreData }: TimeDisplayOriginalProps) {
  const hasWakeUpTime = scoreData?.wakeUpHour && scoreData?.wakeUpMinute;
  const hasBedtime = scoreData?.bedtimeHour && scoreData?.bedtimeMinute;

  const formatTimeValue = (hour?: string, minute?: string) => {
    if (!hour || !minute) return '';
    const h = hour.padStart(2, '0');
    const m = minute.padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <View style={styles.section}>
      <View style={styles.timeRow}>
        <View style={styles.timeEntry}>
          <Text style={styles.timeLabel}>Wake Up Time</Text>
          {hasWakeUpTime ? (
            <View style={styles.timeValueContainer}>
              <Sun size={16} color={COLORS.textSecondary} style={styles.timeIcon} />
              <Text style={styles.timeValue}>
                {formatTimeValue(scoreData.wakeUpHour, scoreData.wakeUpMinute)} {scoreData.wakeUpPeriod}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>Not recorded</Text>
          )}
        </View>

        <View style={styles.timeEntry}>
          <Text style={styles.timeLabel}>Bedtime</Text>
          {hasBedtime ? (
            <View style={styles.timeValueContainer}>
              <Moon size={16} color={COLORS.textSecondary} style={styles.timeIcon} />
              <Text style={styles.timeValue}>
                {formatTimeValue(scoreData.bedtimeHour, scoreData.bedtimeMinute)} {scoreData.bedtimePeriod}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>Not recorded</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeEntry: {
    flex: 1,
  },
  timeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  timeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 8,
  },
  timeValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
}); 