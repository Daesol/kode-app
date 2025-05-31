import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Sun, Moon, Clock } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { ScoreEntry } from '@/context/TrackContext';

interface TimeDisplayProps {
  scoreData: ScoreEntry;
}

export default function TimeDisplay({ scoreData }: TimeDisplayProps) {
  const hasWakeUpTime = scoreData?.wakeUpHour && scoreData?.wakeUpMinute;
  const hasBedtime = scoreData?.bedtimeHour && scoreData?.bedtimeMinute;

  const formatTimeValue = (hour?: string, minute?: string) => {
    if (!hour || !minute) return '';
    const h = hour.padStart(2, '0');
    const m = minute.padStart(2, '0');
    return `${h}:${m}`;
  };

  const getTimeMessage = () => {
    if (hasWakeUpTime && hasBedtime) {
      return "Discipline begins with controlling your time.";
    } else if (hasWakeUpTime) {
      return "Victory starts with early rising.";
    } else if (hasBedtime) {
      return "Rest is a warrior's preparation.";
    }
    return "Master your schedule, master your destiny.";
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>DAILY RHYTHM</Text>
      
      <View style={styles.timeContainer}>
        {/* Wake Up Time */}
        <View style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Sun size={20} color={COLORS.warning} />
            <Text style={styles.timeLabel}>RISE</Text>
          </View>
          {hasWakeUpTime ? (
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValue}>
                {formatTimeValue(scoreData.wakeUpHour, scoreData.wakeUpMinute)}
              </Text>
              <Text style={styles.timePeriod}>{scoreData.wakeUpPeriod}</Text>
            </View>
          ) : (
            <View style={styles.emptyTimeContainer}>
              <Clock size={24} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>NOT SET</Text>
            </View>
          )}
        </View>

        {/* Connection Line */}
        <View style={styles.connectionLine}>
          <View style={styles.lineDash} />
          <View style={styles.lineCenter}>
            <Text style={styles.lineText}>TO</Text>
          </View>
          <View style={styles.lineDash} />
        </View>

        {/* Bedtime */}
        <View style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Moon size={20} color={COLORS.primary} />
            <Text style={styles.timeLabel}>REST</Text>
          </View>
          {hasBedtime ? (
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValue}>
                {formatTimeValue(scoreData.bedtimeHour, scoreData.bedtimeMinute)}
              </Text>
              <Text style={styles.timePeriod}>{scoreData.bedtimePeriod}</Text>
            </View>
          ) : (
            <View style={styles.emptyTimeContainer}>
              <Clock size={24} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>NOT SET</Text>
            </View>
          )}
        </View>
      </View>

      {/* Motivational Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          {getTimeMessage()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  timeCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginLeft: 8,
  },
  timeValueContainer: {
    alignItems: 'center',
  },
  timeValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  timePeriod: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginTop: 2,
  },
  emptyTimeContainer: {
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginTop: 8,
  },
  connectionLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    flex: 0.3,
  },
  lineDash: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.borderColor,
    borderRadius: 1,
  },
  lineCenter: {
    marginHorizontal: 8,
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lineText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  messageContainer: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
}); 