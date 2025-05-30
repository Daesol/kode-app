import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { format, subDays, differenceInDays, isSameDay, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

type RatingData = {
  score: number;
  difficulty: number;
  reflection?: string;
  achievements?: string[];
};

type ScoreEntry = {
  score: number;
  difficulty: number;
  reflection?: string;
  achievements?: string[];
};

type ScoresState = {
  [date: string]: ScoreEntry;
};

type ReminderTimeState = {
  hours: number;
  minutes: number;
};

type TrackContextType = {
  scores: ScoresState;
  reminderTime: ReminderTimeState;
  addScore: (data: RatingData, date?: Date) => void;
  getTodayScore: () => ScoreEntry | undefined;
  getScoreForDate: (date: Date) => ScoreEntry | undefined;
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
  
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
        const threeDaysAgo = format(subDays(new Date(), 3), 'yyyy-MM-dd');
        
        setScores({
          [threeDaysAgo]: { score: 65, difficulty: 3 },
          [twoDaysAgo]: { score: 78, difficulty: 2 },
          [yesterday]: { score: 82, difficulty: 1 },
        });
      } catch (error) {
        console.error('Failed to load saved data', error);
      }
    };
    
    loadSavedData();
  }, []);
  
  const addScore = (data: RatingData, date: Date = new Date()) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setScores(prev => ({
      ...prev,
      [dateString]: {
        score: data.score,
        difficulty: data.difficulty,
        reflection: data.reflection,
        achievements: data.achievements,
      },
    }));
  };
  
  const getTodayScore = (): ScoreEntry | undefined => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return scores[today];
  };
  
  const getScoreForDate = (date: Date): ScoreEntry | undefined => {
    const dateString = format(date, 'yyyy-MM-dd');
    return scores[dateString];
  };
  
  const getWeekAverage = (): number => {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => 
      format(subDays(today, i), 'yyyy-MM-dd')
    );
    
    const weekScores = dates
      .map(date => scores[date]?.score)
      .filter(score => typeof score === 'number') as number[];
    
    if (weekScores.length === 0) return 0;
    
    const sum = weekScores.reduce((acc, score) => acc + score, 0);
    return sum / weekScores.length;
  };
  
  const getAllTimeAverage = (): number => {
    const allScores = Object.values(scores).map(entry => entry.score);
    if (allScores.length === 0) return 0;
    
    const sum = allScores.reduce((acc, score) => acc + score, 0);
    return sum / allScores.length;
  };
  
  const getStreak = (): number => {
    const today = startOfDay(new Date());
    let currentDate = today;
    let streak = 0;
    
    while (true) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      if (!scores[dateString]) {
        // If we haven't logged today yet, check if we have a streak from yesterday
        if (isSameDay(currentDate, today) && scores[format(subDays(today, 1), 'yyyy-MM-dd')]) {
          streak = 1;
        }
        break;
      }
      streak++;
      currentDate = subDays(currentDate, 1);
    }
    
    return streak;
  };
  
  const getCompletionRate = (): number => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    let trackedDays = 0;
    let totalDays = 0;

    // Count only past days up to today
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      if (isWithinInterval(date, { start: thirtyDaysAgo, end: endOfDay(today) })) {
        totalDays++;
        const dateString = format(date, 'yyyy-MM-dd');
        if (scores[dateString]) {
          trackedDays++;
        }
      }
    }
    
    return totalDays > 0 ? (trackedDays / totalDays) * 100 : 0;
  };
  
  const getWeeklyData = (): number[] => {
    const weekData: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      weekData.push(scores[date]?.score || 0);
    }
    
    return weekData;
  };
  
  const updateReminderTime = (time: ReminderTimeState) => {
    setReminderTime(time);
  };
  
  const clearAllScores = () => {
    setScores({});
  };
  
  return (
    <TrackContext.Provider
      value={{
        scores,
        reminderTime,
        addScore,
        getTodayScore,
        getScoreForDate,
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