import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { format, subDays, differenceInDays, isSameDay } from 'date-fns';

type ScoresState = {
  [date: string]: number;
};

type ReminderTimeState = {
  hours: number;
  minutes: number;
};

type TrackContextType = {
  scores: ScoresState;
  reminderTime: ReminderTimeState;
  addScore: (score: number) => void;
  getTodayScore: () => number | null;
  getWeekAverage: () => number;
  getAllTimeAverage: () => number;
  getStreak: () => number;
  getCompletionRate: () => number;
  getWeeklyData: () => number[];
  setReminderTime: (time: ReminderTimeState) => void;
  clearAllScores: () => void;
};

const TrackContext = createContext<TrackContextType | null>(null);

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scores, setScores] = useState<ScoresState>({});
  const [reminderTime, setReminderTime] = useState<ReminderTimeState>({ hours: 21, minutes: 0 });
  
  // Load saved data on initial render
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // For demo purposes, we'll initialize with some sample data
        // In a real app, you would load from AsyncStorage or another persistence method
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
        const threeDaysAgo = format(subDays(new Date(), 3), 'yyyy-MM-dd');
        
        setScores({
          [threeDaysAgo]: 65,
          [twoDaysAgo]: 78,
          [yesterday]: 82,
          // Uncomment to simulate today already being tracked:
          // [today]: 90,
        });
      } catch (error) {
        console.error('Failed to load saved data', error);
      }
    };
    
    loadSavedData();
  }, []);
  
  // Add a new score for today
  const addScore = (score: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setScores(prev => ({
      ...prev,
      [today]: score,
    }));
    
    // In a real app, you would save to AsyncStorage here
  };
  
  // Get today's score if it exists
  const getTodayScore = (): number | null => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return scores[today] || null;
  };
  
  // Calculate the average score for the past 7 days
  const getWeekAverage = (): number => {
    const dates = Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );
    
    const weekScores = dates
      .map(date => scores[date])
      .filter(score => typeof score === 'number') as number[];
    
    if (weekScores.length === 0) return 0;
    
    const sum = weekScores.reduce((acc, score) => acc + score, 0);
    return sum / weekScores.length;
  };
  
  // Calculate all-time average score
  const getAllTimeAverage = (): number => {
    const allScores = Object.values(scores);
    if (allScores.length === 0) return 0;
    
    const sum = allScores.reduce((acc, score) => acc + score, 0);
    return sum / allScores.length;
  };
  
  // Calculate current streak
  const getStreak = (): number => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      if (scores[dateString] !== undefined) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Calculate completion rate (percentage of days tracked in last 30 days)
  const getCompletionRate = (): number => {
    const today = new Date();
    let trackedDays = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      if (scores[date] !== undefined) {
        trackedDays++;
      }
    }
    
    return (trackedDays / 30) * 100;
  };
  
  // Get data for weekly chart
  const getWeeklyData = (): number[] => {
    const weekData: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      weekData.push(scores[date] || 0);
    }
    
    return weekData;
  };
  
  // Update reminder time
  const updateReminderTime = (time: ReminderTimeState) => {
    setReminderTime(time);
    // In a real app, you would save to AsyncStorage and schedule notifications here
  };
  
  // Clear all scores
  const clearAllScores = () => {
    setScores({});
    // In a real app, you would clear from AsyncStorage here
  };
  
  return (
    <TrackContext.Provider
      value={{
        scores,
        reminderTime,
        addScore,
        getTodayScore,
        getWeekAverage,
        getAllTimeAverage,
        getStreak,
        getCompletionRate,
        getWeeklyData,
        setReminderTime: updateReminderTime,
        clearAllScores,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrack = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
};