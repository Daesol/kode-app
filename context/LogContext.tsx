import React, { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';

export type LogEntry = {
  id: string;
  userId: string;
  date: string; // e.g. '2025-05-31'
  type: 'achievement';
  content: string; // e.g. "Added: Completed major presentation"
  createdAt: Date;
  visibleTo: 'friends' | 'group' | 'private';
};

type LogsState = {
  [date: string]: LogEntry[];
};

type LogContextType = {
  logs: LogsState;
  updateLogsForAchievements: (
    userId: string,
    date: Date,
    oldAchievements: string[],
    newAchievements: string[]
  ) => void;
  getAllLogs: () => LogEntry[];
  getLogsForDate: (date: Date) => LogEntry[];
};

const LogContext = createContext<LogContextType | null>(null);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogsState>({});

  const generateLogId = (): string => {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const updateLogsForAchievements = (
    userId: string,
    date: Date,
    oldAchievements: string[],
    newAchievements: string[]
  ) => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Detect added achievements
    const addedAchievements = newAchievements.filter(
      achievement => !oldAchievements.includes(achievement)
    );
    
    // Detect removed achievements
    const removedAchievements = oldAchievements.filter(
      achievement => !newAchievements.includes(achievement)
    );

    setLogs(prevLogs => {
      const updatedLogs = { ...prevLogs };
      
      // Remove old logs for this date and user (we'll regenerate them)
      if (updatedLogs[dateString]) {
        updatedLogs[dateString] = updatedLogs[dateString].filter(
          log => !(log.userId === userId && log.type === 'achievement')
        );
      } else {
        updatedLogs[dateString] = [];
      }

      // Add logs for added achievements
      addedAchievements.forEach(achievement => {
        const newLog: LogEntry = {
          id: generateLogId(),
          userId,
          date: dateString,
          type: 'achievement',
          content: `Added: ${achievement}`,
          createdAt: new Date(),
          visibleTo: 'friends'
        };
        updatedLogs[dateString].push(newLog);
      });

      // Add logs for removed achievements
      removedAchievements.forEach(achievement => {
        const newLog: LogEntry = {
          id: generateLogId(),
          userId,
          date: dateString,
          type: 'achievement',
          content: `Removed: ${achievement}`,
          createdAt: new Date(),
          visibleTo: 'friends'
        };
        updatedLogs[dateString].push(newLog);
      });

      // Clean up empty arrays
      if (updatedLogs[dateString].length === 0) {
        delete updatedLogs[dateString];
      }

      return updatedLogs;
    });
  };

  const getAllLogs = (): LogEntry[] => {
    const allLogs: LogEntry[] = [];
    Object.values(logs).forEach(dayLogs => {
      allLogs.push(...dayLogs);
    });
    // Sort by creation date, newest first
    return allLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const getLogsForDate = (date: Date): LogEntry[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return logs[dateString] || [];
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        updateLogsForAchievements,
        getAllLogs,
        getLogsForDate,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
}; 