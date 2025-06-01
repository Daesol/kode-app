import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLog } from '@/context/LogContext';
import LogCard from '@/components/LogCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { getAllLogs } = useLog();
  
  const logs = getAllLogs();

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Activity Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking achievements in your daily journal to see activity updates here!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home Feed</Text>
        {logs.length > 0 && (
          <Text style={styles.headerSubtitle}>
            {logs.length} recent {logs.length === 1 ? 'update' : 'updates'}
          </Text>
        )}
      </View>
      
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogCard logEntry={item} />}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  feedContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for tab bar
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});