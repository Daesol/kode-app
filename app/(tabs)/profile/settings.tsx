import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { COLORS } from '@/constants/theme';
import TimePickerModal from '@/components/TimePickerModal';
import { useTrack } from '@/context/TrackContext';
import { Bell, Clock, Trash2, Moon, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { reminderTime, setReminderTime, clearAllScores } = useTrack();
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const toggleNotifications = () => {
    setNotificationsEnabled(previous => !previous);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(previous => !previous);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleTimeSelected = (hours: number, minutes: number) => {
    setReminderTime({ hours, minutes });
    setShowTimePicker(false);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const confirmClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your tracking data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear Data", 
          style: "destructive",
          onPress: () => {
            clearAllScores();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        }
      ]
    );
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
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={22} color={COLORS.textPrimary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: COLORS.switchTrackOff, true: COLORS.primary }}
              thumbColor={COLORS.switchThumb}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              if (notificationsEnabled) {
                setShowTimePicker(true);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }
            }}
            disabled={!notificationsEnabled}
          >
            <View style={styles.settingLeft}>
              <Clock 
                size={22} 
                color={notificationsEnabled ? COLORS.textPrimary : COLORS.textDisabled} 
                style={styles.settingIcon}
              />
              <View>
                <Text style={[
                  styles.settingLabel,
                  !notificationsEnabled && styles.disabledText
                ]}>
                  Daily Reminder Time
                </Text>
                <Text style={[
                  styles.settingValue,
                  !notificationsEnabled && styles.disabledText
                ]}>
                  {formatTime(reminderTime)}
                </Text>
              </View>
            </View>
            <ChevronRight 
              size={20} 
              color={notificationsEnabled ? COLORS.textSecondary : COLORS.textDisabled} 
            />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Moon size={22} color={COLORS.textPrimary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: COLORS.switchTrackOff, true: COLORS.primary }}
              thumbColor={COLORS.switchThumb}
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Data</Text>
        
        <View style={styles.settingGroup}>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={confirmClearData}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={22} color={COLORS.error} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: COLORS.error }]}>
                Clear All Data
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingGroup}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={22} color={COLORS.textPrimary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.versionLabel}>Version</Text>
            </View>
            <Text style={styles.versionValue}>1.0.0</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 20,
  },
  settingGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    marginBottom: 25,
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
  },
  settingIcon: {
    marginRight: 16,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  disabledText: {
    color: COLORS.textDisabled,
  },
  versionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  versionValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});