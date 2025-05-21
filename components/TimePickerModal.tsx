import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from 'react-native';
import { COLORS, FONT } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type TimePickerModalProps = {
  initialHours: number;
  initialMinutes: number;
  onConfirm: (hours: number, minutes: number) => void;
  onCancel: () => void;
};

export default function TimePickerModal({
  initialHours,
  initialMinutes,
  onConfirm,
  onCancel
}: TimePickerModalProps) {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  
  const incrementHours = () => {
    setHours((prev) => (prev === 23 ? 0 : prev + 1));
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const decrementHours = () => {
    setHours((prev) => (prev === 0 ? 23 : prev - 1));
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const incrementMinutes = () => {
    setMinutes((prev) => (prev === 59 ? 0 : prev + 1));
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const decrementMinutes = () => {
    setMinutes((prev) => (prev === 0 ? 59 : prev - 1));
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : `${value}`;
  };
  
  const handleCancel = () => {
    onCancel();
  };
  
  const handleConfirm = () => {
    onConfirm(hours, minutes);
  };
  
  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
        )}
        
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Daily Reminder Time</Text>
          
          <View style={styles.timePickerContainer}>
            <View style={styles.timeColumn}>
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={incrementHours}
              >
                <ChevronUp size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <Text style={styles.timeText}>{formatTime(hours)}</Text>
              
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={decrementHours}
              >
                <ChevronDown size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <Text style={styles.timeLabel}>Hours</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeColumn}>
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={incrementMinutes}
              >
                <ChevronUp size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <Text style={styles.timeText}>{formatTime(minutes)}</Text>
              
              <TouchableOpacity 
                style={styles.timeButton} 
                onPress={decrementMinutes}
              >
                <ChevronDown size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    width: 80,
  },
  timeButton: {
    padding: 10,
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: COLORS.textPrimary,
    marginVertical: 10,
  },
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  timeSeparator: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: COLORS.textPrimary,
    marginHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  confirmButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});