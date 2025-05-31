import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface TimeEntryProps {
  label: string;
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
  onHourChange: (text: string) => void;
  onMinuteChange: (text: string) => void;
  onPeriodChange: (period: 'AM' | 'PM') => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function TimeEntry({
  label,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onValidationChange,
}: TimeEntryProps) {
  const [rawInput, setRawInput] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    // Only initialize once from props
    if (!isInitialized && hour && minute) {
      const h = parseInt(hour).toString();
      const m = minute;
      // Only set if it's a meaningful time
      if (h !== '0' || m !== '00') {
        setRawInput(`${h}${m}`);
      }
      setIsInitialized(true);
    }
  }, [hour, minute, isInitialized]);

  const validateTime = (hourNum: number, minuteNum: number) => {
    // Hour should be 1-12 (after conversion) and minutes 0-59
    return hourNum >= 0 && hourNum <= 23 && minuteNum >= 0 && minuteNum <= 59;
  };

  const handleTextChange = (text: string) => {
    // Only allow numbers
    const numbersOnly = text.replace(/\D/g, '');
    
    // Store the raw input
    setRawInput(numbersOnly);
    setIsInvalid(false); // Reset invalid state
    let isValid = true; // Track validation for callback

    // Parse the input based on length
    if (numbersOnly.length === 0) {
      // Clear everything
      onHourChange('');
      onMinuteChange('');
      isValid = true; // Empty is considered valid
    } else if (numbersOnly.length === 1) {
      // Single digit - could be hour 1-9
      onHourChange(numbersOnly);
      onMinuteChange('');
      isValid = true; // Incomplete entry is valid
    } else if (numbersOnly.length === 2) {
      // Two digits
      const num = parseInt(numbersOnly);
      
      // Only process as complete hour if it's 00-23
      if (num >= 0 && num <= 23) {
        if (num === 0) {
          onHourChange('12');
          onMinuteChange('00');
        } else if (num >= 1 && num <= 12) {
          onHourChange(String(num));
          onMinuteChange('00');
        } else {
          // 13-23 - convert to 12-hour format
          onHourChange(String(num - 12));
          onMinuteChange('00');
        }
        isValid = true;
      } else {
        // For 24-99, don't update parent - wait for more digits
        isValid = true; // Incomplete entry
      }
    } else if (numbersOnly.length === 3) {
      // 3 digits: H:MM format
      const h = numbersOnly[0];
      const m = numbersOnly.substring(1, 3);
      const hourNum = parseInt(h);
      const minNum = parseInt(m);
      
      if (hourNum === 0) {
        onHourChange('12');
      } else {
        onHourChange(h);
      }
      onMinuteChange(minNum > 59 ? '59' : m);
      
      // Validate
      isValid = validateTime(hourNum, minNum);
      if (!isValid) {
        setIsInvalid(true);
      }
    } else if (numbersOnly.length >= 4) {
      // 4+ digits: HH:MM format
      const h = numbersOnly.substring(0, 2);
      const m = numbersOnly.substring(2, 4);
      const hourNum = parseInt(h);
      const minNum = parseInt(m);
      
      // Handle military time conversion
      if (hourNum === 0) {
        // 00:XX is midnight
        onHourChange('12');
      } else if (hourNum >= 1 && hourNum <= 12) {
        onHourChange(String(hourNum));
      } else if (hourNum >= 13 && hourNum <= 23) {
        // Convert military time
        onHourChange(String(hourNum - 12));
      } else {
        // 24+ are invalid
        onHourChange(String(hourNum));
        setIsInvalid(true);
      }
      
      onMinuteChange(minNum > 59 ? '59' : m);
      
      // Validate the complete time
      isValid = validateTime(hourNum, minNum);
      if (!isValid) {
        setIsInvalid(true);
      }
    }

    // Notify parent about validation state
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  };

  // Format for display only
  const getDisplayValue = () => {
    if (!rawInput) return '';
    
    const len = rawInput.length;
    
    if (len <= 2) {
      return rawInput;
    } else if (len === 3) {
      return `${rawInput[0]}:${rawInput.substring(1)}`;
    } else {
      const h = rawInput.substring(0, 2);
      const m = rawInput.substring(2, 4);
      const hourNum = parseInt(h);
      
      let displayHour = hourNum;
      if (hourNum >= 13 && hourNum <= 23) {
        displayHour = hourNum - 12;
      } else if (hourNum === 0) {
        displayHour = 12;
      }
      
      return `${displayHour}:${m}`;
    }
  };

  return (
    <View style={styles.timeEntry}>
      <View style={styles.timeInputContainer}>
        {!getDisplayValue() && (
          <Text style={styles.placeholder}>
            {label === "Wake Up Time" ? "Wake Time" : "Sleep Time"}
          </Text>
        )}
        <View style={styles.inputWithIcon}>
          {getDisplayValue() && (
            <View style={styles.timeIcon}>
              {label === "Wake Up Time" ? (
                <Sun size={16} color={COLORS.textSecondary} />
              ) : (
                <Moon size={16} color={COLORS.textSecondary} />
              )}
            </View>
          )}
          <TextInput
            style={[
              styles.timeInput,
              isInvalid && styles.timeInputInvalid,
              !getDisplayValue() && styles.transparentPlaceholder,
              getDisplayValue() && styles.timeInputWithIcon,
            ]}
            value={getDisplayValue()}
            onChangeText={handleTextChange}
            placeholder={label === "Wake Up Time" ? "Wake Time" : "Sleep Time"}
            placeholderTextColor="transparent"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.periodContainer}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'AM' && styles.periodButtonActive]}
            onPress={() => onPeriodChange('AM')}
          >
            <Text style={[styles.periodText, period === 'AM' && styles.periodTextActive]}>AM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'PM' && styles.periodButtonActive]}
            onPress={() => onPeriodChange('PM')}
          >
            <Text style={[styles.periodText, period === 'PM' && styles.periodTextActive]}>PM</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isInvalid && (
        <Text style={styles.errorText}>Invalid time format</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timeEntry: {
    flex: 1,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  inputWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  timeIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  timeInput: {
    flex: 1,
    minWidth: 80,
    height: 40,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeInputWithIcon: {
    paddingLeft: 36,
  },
  timeInputInvalid: {
    borderColor: COLORS.error,
  },
  placeholder: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -7 }],
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  transparentPlaceholder: {
    color: 'transparent',
  },
  periodContainer: {
    flexDirection: 'row',
    marginLeft: 8,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    height: 40,
  },
  periodButton: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  periodTextActive: {
    color: COLORS.textPrimary,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 1,
  },
}); 