import { TeamMemberWithSchedules, OverlapPeriod, MeetingSuggestion, ScheduleBlock } from "@shared/schema";

// Convert time string (HH:MM) to percentage of the day (7:00-19:00 = 0-100%)
export function timeToPercentage(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startOfDay = 7 * 60; // 7:00 AM
  const endOfDay = 19 * 60; // 7:00 PM
  const dayLength = endOfDay - startOfDay;
  
  return Math.max(0, Math.min(100, ((totalMinutes - startOfDay) / dayLength) * 100));
}

// Convert percentage back to time string
export function percentageToTime(percentage: number): string {
  const startOfDay = 7 * 60; // 7:00 AM
  const endOfDay = 19 * 60; // 7:00 PM
  const dayLength = endOfDay - startOfDay;
  
  const totalMinutes = startOfDay + (percentage / 100) * dayLength;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Snap time to nearest 15-minute interval
export function snapToTimeSlot(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const snappedMinutes = Math.round(minutes / 15) * 15;
  const finalMinutes = snappedMinutes === 60 ? 0 : snappedMinutes;
  const finalHours = snappedMinutes === 60 ? hours + 1 : hours;
  
  return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}

// Calculate time overlaps between team members
export function calculateOverlaps(members: TeamMemberWithSchedules[], dayOfWeek: string): OverlapPeriod[] {
  const workSchedules = members
    .flatMap(member => 
      member.schedules
        .filter(s => s.dayOfWeek === dayOfWeek && s.type === 'work')
        .map(s => ({ ...s, memberName: member.name, memberId: member.id }))
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (workSchedules.length < 2) return [];

  const overlaps: OverlapPeriod[] = [];
  const timeSlots: { [key: string]: Array<{ memberId: number; memberName: string }> } = {};

  // Create 15-minute time slots and track who's available
  workSchedules.forEach(schedule => {
    const start = timeStringToMinutes(schedule.startTime);
    const end = timeStringToMinutes(schedule.endTime);
    
    for (let time = start; time < end; time += 15) {
      const timeKey = minutesToTimeString(time);
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = [];
      }
      timeSlots[timeKey].push({
        memberId: schedule.memberId,
        memberName: schedule.memberName,
      });
    }
  });

  // Find continuous overlaps with 2+ members
  let currentOverlap: OverlapPeriod | null = null;
  
  Object.entries(timeSlots)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([timeKey, members]) => {
      if (members.length >= 2) {
        if (currentOverlap && 
            currentOverlap.count === members.length &&
            arraysEqual(currentOverlap.memberIds, members.map(m => m.memberId))) {
          // Extend current overlap
          currentOverlap.endTime = addMinutesToTime(timeKey, 15);
        } else {
          // Start new overlap
          if (currentOverlap) {
            overlaps.push(currentOverlap);
          }
          currentOverlap = {
            startTime: timeKey,
            endTime: addMinutesToTime(timeKey, 15),
            memberIds: members.map(m => m.memberId),
            memberNames: members.map(m => m.memberName),
            count: members.length,
          };
        }
      } else {
        // End current overlap
        if (currentOverlap) {
          overlaps.push(currentOverlap);
          currentOverlap = null;
        }
      }
    });

  if (currentOverlap) {
    overlaps.push(currentOverlap);
  }

  return overlaps;
}

// Generate meeting suggestions based on team availability
export function generateMeetingSuggestions(
  members: TeamMemberWithSchedules[], 
  dayOfWeek: string
): MeetingSuggestion[] {
  const overlaps = calculateOverlaps(members, dayOfWeek);
  const suggestions: MeetingSuggestion[] = [];

  // Daily meeting: 15 minutes, needs at least 3 people
  const dailyOverlaps = overlaps.filter(o => 
    o.count >= 3 && 
    timeStringToMinutes(o.endTime) - timeStringToMinutes(o.startTime) >= 15
  );
  
  if (dailyOverlaps.length > 0) {
    const bestDaily = dailyOverlaps[0]; // First available slot
    suggestions.push({
      type: 'daily',
      startTime: bestDaily.startTime,
      endTime: addMinutesToTime(bestDaily.startTime, 15),
      participants: bestDaily.memberNames,
      memberIds: bestDaily.memberIds,
      dayOfWeek,
    });
  }

  // Review/Retro: 90 minutes, needs at least 4 people
  const reviewOverlaps = overlaps.filter(o => 
    o.count >= 4 && 
    timeStringToMinutes(o.endTime) - timeStringToMinutes(o.startTime) >= 90
  );
  
  if (reviewOverlaps.length > 0) {
    const bestReview = reviewOverlaps[0];
    suggestions.push({
      type: 'review',
      startTime: bestReview.startTime,
      endTime: addMinutesToTime(bestReview.startTime, 90),
      participants: bestReview.memberNames,
      memberIds: bestReview.memberIds,
      dayOfWeek,
    });
  }

  // Planning: 120 minutes, needs at least 4 people
  const planningOverlaps = overlaps.filter(o => 
    o.count >= 4 && 
    timeStringToMinutes(o.endTime) - timeStringToMinutes(o.startTime) >= 120
  );
  
  if (planningOverlaps.length > 0) {
    const bestPlanning = planningOverlaps[0];
    suggestions.push({
      type: 'planning',
      startTime: bestPlanning.startTime,
      endTime: addMinutesToTime(bestPlanning.startTime, 120),
      participants: bestPlanning.memberNames,
      memberIds: bestPlanning.memberIds,
      dayOfWeek,
    });
  }

  return suggestions;
}

// Helper functions
function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function addMinutesToTime(time: string, minutes: number): string {
  const totalMinutes = timeStringToMinutes(time) + minutes;
  return minutesToTimeString(totalMinutes);
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every(val => b.includes(val));
}
