import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").default(true),
});

export const scheduleBlocks = pgTable("schedule_blocks", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // monday, tuesday, etc.
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  type: text("type").notNull().default("work"), // work, lunch, break
});

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // daily, review, planning
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  participants: text("participants").array(),
});

// Schemas
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  isActive: true,
});

export const insertScheduleBlockSchema = createInsertSchema(scheduleBlocks).omit({
  id: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
});

// Types
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type ScheduleBlock = typeof scheduleBlocks.$inferSelect;
export type InsertScheduleBlock = z.infer<typeof insertScheduleBlockSchema>;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

// Extended types for frontend
export type TeamMemberWithSchedules = TeamMember & {
  schedules: ScheduleBlock[];
};

export type OverlapPeriod = {
  startTime: string;
  endTime: string;
  memberIds: number[];
  memberNames: string[];
  count: number;
};

export type MeetingSuggestion = {
  type: 'daily' | 'review' | 'planning';
  startTime: string;
  endTime: string;
  participants: string[];
  memberIds: number[];
  dayOfWeek: string;
};
