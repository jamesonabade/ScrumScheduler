import { useMemo } from 'react';
import { TeamMemberWithSchedules, OverlapPeriod, MeetingSuggestion } from '@shared/schema';
import { calculateOverlaps, generateMeetingSuggestions } from '@/lib/schedule-utils';

export function useSchedule() {
  const calculateScheduleOverlaps = useMemo(
    () => (members: TeamMemberWithSchedules[], dayOfWeek: string): OverlapPeriod[] => {
      return calculateOverlaps(members, dayOfWeek);
    },
    []
  );

  const generateScheduleMeetingSuggestions = useMemo(
    () => (members: TeamMemberWithSchedules[], dayOfWeek: string): MeetingSuggestion[] => {
      return generateMeetingSuggestions(members, dayOfWeek);
    },
    []
  );

  return {
    calculateOverlaps: calculateScheduleOverlaps,
    generateMeetingSuggestions: generateScheduleMeetingSuggestions,
  };
}
