import { format, subDays } from 'date-fns';
import { ScoreEntry } from '@/context/TrackContext';

// Generate 10 days of mock data going backwards from today
export const generateMockData = (): Record<string, ScoreEntry> => {
  const today = new Date();
  const mockData: Record<string, ScoreEntry> = {};

  // Day 1 - Yesterday (High Performance Day)
  const day1 = format(subDays(today, 1), 'yyyy-MM-dd');
  mockData[day1] = {
    score: 87,
    difficulty: 2,
    wakeUpHour: '6',
    wakeUpMinute: '30',
    wakeUpPeriod: 'AM',
    bedtimeHour: '10',
    bedtimeMinute: '15',
    bedtimePeriod: 'PM',
    achievements: ['Completed morning workout', 'Finished project milestone', 'Meal prepped for the week'],
    distractions: ['Quick social media check'],
    reflection: 'Had an incredibly productive day. Woke up early and maintained focus throughout. The morning workout set a positive tone for everything else.'
  };

  // Day 2 - Two days ago (Moderate Day - Missing some data)
  const day2 = format(subDays(today, 2), 'yyyy-MM-dd');
  mockData[day2] = {
    score: 63,
    difficulty: 3,
    wakeUpHour: '7',
    wakeUpMinute: '45',
    wakeUpPeriod: 'AM',
    bedtimeHour: '11',
    bedtimeMinute: '30',
    bedtimePeriod: 'PM',
    achievements: ['Attended important meeting'],
    // No distractions recorded
    // No reflection recorded
  };

  // Day 3 - Three days ago (Challenging Day)
  const day3 = format(subDays(today, 3), 'yyyy-MM-dd');
  mockData[day3] = {
    score: 45,
    difficulty: 4,
    wakeUpHour: '9',
    wakeUpMinute: '15',
    wakeUpPeriod: 'AM',
    bedtimeHour: '12',
    bedtimeMinute: '45',
    bedtimePeriod: 'AM',
    // No achievements recorded
    distractions: ['Netflix binge session', 'Endless scrolling on phone', 'Got lost in YouTube videos'],
    reflection: 'Struggled today. Woke up late and couldn\'t get into a productive rhythm. Need to be more mindful about screen time before bed.'
  };

  // Day 4 - Four days ago (Weekend Recovery)
  const day4 = format(subDays(today, 4), 'yyyy-MM-dd');
  mockData[day4] = {
    score: 72,
    difficulty: 2,
    wakeUpHour: '8',
    wakeUpMinute: '00',
    wakeUpPeriod: 'AM',
    bedtimeHour: '10',
    bedtimeMinute: '30',
    bedtimePeriod: 'PM',
    achievements: ['Quality time with family', 'Organized workspace', 'Read for 2 hours'],
    distractions: ['Online shopping'],
    // No reflection recorded
  };

  // Day 5 - Five days ago (Solid Weekday)
  const day5 = format(subDays(today, 5), 'yyyy-MM-dd');
  mockData[day5] = {
    score: 78,
    difficulty: 3,
    wakeUpHour: '6',
    wakeUpMinute: '45',
    wakeUpPeriod: 'AM',
    bedtimeHour: '10',
    bedtimeMinute: '00',
    bedtimePeriod: 'PM',
    achievements: ['Completed all daily tasks', 'Had meaningful conversation with colleague'],
    distractions: ['Email notifications during deep work'],
    reflection: 'Good balance today. Felt productive but not overwhelmed. The key was blocking time for focused work.'
  };

  // Day 6 - Six days ago (Low Energy Day - Minimal data)
  const day6 = format(subDays(today, 6), 'yyyy-MM-dd');
  mockData[day6] = {
    score: 38,
    difficulty: 5,
    // No wake/sleep time recorded
    // No achievements recorded
    distractions: ['Stress eating', 'Doom scrolling news'],
    // No reflection recorded
  };

  // Day 7 - Seven days ago (Weekend Relaxation)
  const day7 = format(subDays(today, 7), 'yyyy-MM-dd');
  mockData[day7] = {
    score: 58,
    difficulty: 1,
    wakeUpHour: '10',
    wakeUpMinute: '30',
    wakeUpPeriod: 'AM',
    bedtimeHour: '11',
    bedtimeMinute: '45',
    bedtimePeriod: 'PM',
    achievements: ['Enjoyed nature walk', 'Cooked healthy meal'],
    // No distractions recorded
    reflection: 'Intentionally took it slow today. Sometimes rest is the most productive thing you can do.'
  };

  // Day 8 - Eight days ago (Strong Performance)
  const day8 = format(subDays(today, 8), 'yyyy-MM-dd');
  mockData[day8] = {
    score: 91,
    difficulty: 2,
    wakeUpHour: '6',
    wakeUpMinute: '00',
    wakeUpPeriod: 'AM',
    bedtimeHour: '9',
    bedtimeMinute: '45',
    bedtimePeriod: 'PM',
    achievements: ['Early morning meditation', 'Completed major presentation', 'Helped team member with problem', 'Stuck to meal plan'],
    distractions: ['Brief news check'],
    reflection: 'One of my best days in recent memory. Everything clicked. Early wake-up and meditation set the foundation for sustained focus and energy.'
  };

  // Day 9 - Nine days ago (Moderate Struggle)
  const day9 = format(subDays(today, 9), 'yyyy-MM-dd');
  mockData[day9] = {
    score: 52,
    difficulty: 4,
    wakeUpHour: '8',
    wakeUpMinute: '30',
    wakeUpPeriod: 'AM',
    bedtimeHour: '12',
    bedtimeMinute: '15',
    bedtimePeriod: 'AM',
    achievements: ['Attended gym class'],
    distractions: ['Work interruptions', 'Procrastination on important task'],
    // No reflection recorded
  };

  // Day 10 - Ten days ago (Decent Start)
  const day10 = format(subDays(today, 10), 'yyyy-MM-dd');
  mockData[day10] = {
    score: 69,
    difficulty: 3,
    wakeUpHour: '7',
    wakeUpMinute: '15',
    wakeUpPeriod: 'AM',
    bedtimeHour: '10',
    bedtimeMinute: '30',
    bedtimePeriod: 'PM',
    achievements: ['Started new learning course', 'Organized schedule for the week'],
    // No distractions recorded
    reflection: 'Setting intentions for the week ahead. Feeling optimistic about upcoming challenges and opportunities for growth.'
  };

  return mockData;
}; 