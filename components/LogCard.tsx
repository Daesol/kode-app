import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';
import { Trophy } from 'lucide-react-native';
import { LogEntry } from '@/context/LogContext';
import { formatDistanceToNow } from 'date-fns';

interface LogCardProps {
  logEntry: LogEntry;
}

// Mock user data for now
const getUserData = (userId: string) => {
  // In a real app, this would be a database lookup
  const mockUsers: Record<string, { name: string; avatar: string; initials: string }> = {
    'user123': {
      name: 'John Doe',
      avatar: '', // placeholder for now
      initials: 'JD'
    },
    // Add more mock users as needed
  };
  
  return mockUsers[userId] || {
    name: 'Unknown User',
    avatar: '',
    initials: '??'
  };
};

export default function LogCard({ logEntry }: LogCardProps) {
  const userData = getUserData(logEntry.userId);
  const timeAgo = formatDistanceToNow(logEntry.createdAt, { addSuffix: true });
  
  const getLogIcon = () => {
    switch (logEntry.type) {
      case 'achievement':
        return <Trophy size={16} color={COLORS.warning} />;
      default:
        return <Trophy size={16} color={COLORS.primary} />;
    }
  };
  
  const getLogTypeLabel = () => {
    switch (logEntry.type) {
      case 'achievement':
        return 'Achievement';
      default:
        return 'Update';
    }
  };

  return (
    <View style={styles.card}>
      {/* Header with user info and timestamp */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userData.initials}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData.name}</Text>
            <View style={styles.logMeta}>
              {getLogIcon()}
              <Text style={styles.logType}>{getLogTypeLabel()}</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.timestamp}>{timeAgo}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Log content */}
      <View style={styles.content}>
        <Text style={styles.logContent}>{logEntry.content}</Text>
      </View>
      
      {/* Footer with visibility indicator if needed */}
      {logEntry.visibleTo !== 'friends' && (
        <View style={styles.footer}>
          <Text style={styles.visibility}>
            Visible to: {logEntry.visibleTo}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logType: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.warning,
    marginLeft: 4,
  },
  separator: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  timestamp: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  visibility: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
}); 