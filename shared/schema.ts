import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  email: text("email"),
  position: text("position"),
  timezone: text("timezone").default("America/Sao_Paulo"),
  isActive: boolean("is_active").default(true),
});

export const scheduleBlocks = pgTable("schedule_blocks", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // monday, tuesday, etc.
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  type: text("type").notNull().default("work"), // work, lunch, break
  description: text("description"),
});

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // daily, review, planning
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  participants: text("participants").array(),
  description: text("description"),
  googleEventId: text("google_event_id"),
  notificationSent: boolean("notification_sent").default(false),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // meeting_reminder, schedule_change
  title: text("title").notNull(),
  message: text("message").notNull(),
  targetDate: text("target_date").notNull(), // YYYY-MM-DD
  targetTime: text("target_time").notNull(), // HH:MM
  isRead: boolean("is_read").default(false),
  createdAt: text("created_at").notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
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
  notificationSent: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

// Types
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type ScheduleBlock = typeof scheduleBlocks.$inferSelect;
export type InsertScheduleBlock = z.infer<typeof insertScheduleBlockSchema>;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

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
