import { useTrack, RatingData } from '@/context/TrackContext';
import { useLog } from '@/context/LogContext';

export const useJournalWithLogs = () => {
  const trackContext = useTrack();
  const logContext = useLog();
  
  const addScoreWithLogs = (data: RatingData, date: Date = new Date()) => {
    // Get old achievements before updating
    const oldScoreData = trackContext.getScoreForDate(date);
    const oldAchievements = oldScoreData?.achievements || [];
    const newAchievements = data.achievements || [];
    
    // Hardcoded userId for now as requested
    const userId = 'user123';
    
    // Update the score data
    trackContext.addScore(data, date);
    
    // Update logs for achievement changes
    logContext.updateLogsForAchievements(userId, date, oldAchievements, newAchievements);
  };
  
  return {
    ...trackContext,
    ...logContext,
    addScoreWithLogs,
  };
}; 