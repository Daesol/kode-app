import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Bell, Moon, Shield } from 'lucide-react-native';
import TimePickerModal from '@/components/TimePickerModal';
import { useTrack } from '@/context/TrackContext';

export default function SettingsScreen() {
  const { reminderTime, setReminderTime } = useTrack();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleTimeSelected = (hours: number, minutes: number) => {
    setReminderTime({ hours, minutes });
    setShowTimePicker(false);
  };
  
  const formatTime = (time: { hours: number, minutes: number }) => {
    const { hours, minutes } = time;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        
        <View style={styles.settingGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}20` }]}>
                <Bell size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>Get daily reminders</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.switchTrackOff, true: COLORS.primary }}
              thumbColor={COLORS.switchThumb}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => notificationsEnabled && setShowTimePicker(true)}
            disabled={!notificationsEnabled}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}20` }]}>
                <Bell size={22} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, !notificationsEnabled && styles.disabledText]}>
                  Reminder Time
                </Text>
                <Text style={[styles.settingDescription, !notificationsEnabled && styles.disabledText]}>
                  {formatTime(reminderTime)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.tertiary}20` }]}>
                <Moon size={22} color={COLORS.tertiary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Toggle dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.switchTrackOff, true: COLORS.primary }}
              thumbColor={COLORS.switchThumb}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <View style={styles.settingGroup}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}20` }]}>
                <Shield size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Data & Privacy</Text>
                <Text style={styles.settingDescription}>Manage your data</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {showTimePicker && (
        <TimePickerModal
          initialHours={reminderTime.hours}
          initialMinutes={reminderTime.minutes}
          onConfirm={handleTimeSelected}
          onCancel={() => setShowTimePicker(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  settingGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  disabledText: {
    color: COLORS.textDisabled,
  },
});