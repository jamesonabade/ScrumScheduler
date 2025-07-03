import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeamMemberSchema, insertScheduleBlockSchema, insertMeetingSchema, insertNotificationSchema, insertSettingSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { notifications, settings } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Team Members
  app.get("/api/team-members", async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get("/api/team-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getTeamMemberById(id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  app.post("/api/team-members", async (req, res) => {
    try {
      const memberData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put("/api/team-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memberData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, memberData);
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Schedule Blocks
  app.get("/api/schedule-blocks", async (req, res) => {
    try {
      const { memberId, dayOfWeek } = req.query;
      let blocks;
      
      if (memberId) {
        blocks = await storage.getScheduleBlocksByMemberId(parseInt(memberId as string));
      } else if (dayOfWeek) {
        blocks = await storage.getScheduleBlocksByDay(dayOfWeek as string);
      } else {
        blocks = await storage.getScheduleBlocks();
      }
      
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule blocks" });
    }
  });

  app.post("/api/schedule-blocks", async (req, res) => {
    try {
      const blockData = insertScheduleBlockSchema.parse(req.body);
      const block = await storage.createScheduleBlock(blockData);
      res.status(201).json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create schedule block" });
    }
  });

  app.put("/api/schedule-blocks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blockData = insertScheduleBlockSchema.partial().parse(req.body);
      const block = await storage.updateScheduleBlock(id, blockData);
      res.json(block);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update schedule block" });
    }
  });

  app.delete("/api/schedule-blocks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteScheduleBlock(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule block" });
    }
  });

  // Meetings
  app.get("/api/meetings", async (req, res) => {
    try {
      const { dayOfWeek } = req.query;
      let meetings;
      
      if (dayOfWeek) {
        meetings = await storage.getMeetingsByDay(dayOfWeek as string);
      } else {
        meetings = await storage.getMeetings();
      }
      
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const meetingData = insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(meetingData);
      res.status(201).json(meeting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create meeting" });
    }
  });

  app.put("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const meetingData = insertMeetingSchema.partial().parse(req.body);
      const meeting = await storage.updateMeeting(id, meetingData);
      res.json(meeting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update meeting" });
    }
  });

  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMeeting(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meeting" });
    }
  });

  // Combined endpoints
  app.get("/api/schedule/:dayOfWeek", async (req, res) => {
    try {
      const dayOfWeek = req.params.dayOfWeek;
      const membersWithSchedules = await storage.getTeamMembersWithSchedules(dayOfWeek);
      const meetings = await storage.getMeetingsByDay(dayOfWeek);
      
      res.json({
        members: membersWithSchedules,
        meetings,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule data" });
    }
  });

  // Notifications endpoints
  app.get("/api/notifications", async (req, res) => {
    try {
      const result = await db.select().from(notifications).orderBy(notifications.createdAt);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const [notification] = await db
        .insert(notifications)
        .values({
          ...notificationData,
          createdAt: new Date().toISOString(),
        })
        .returning();
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const [notification] = await db
        .update(notifications)
        .set(updateData)
        .where(eq(notifications.id, id))
        .returning();
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(notifications).where(eq(notifications.id, id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  app.put("/api/notifications/mark-all-read", async (req, res) => {
    try {
      await db.update(notifications).set({ isRead: true });
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notifications as read" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const result = await db.select().from(settings);
      const settingsMap = result.reduce((acc: any, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      res.json(settingsMap);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const [setting] = await db
        .insert(settings)
        .values(settingData)
        .returning();
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create setting" });
    }
  });

  app.post("/api/settings/bulk", async (req, res) => {
    try {
      const settingsData = req.body;
      const results = [];

      for (const [key, value] of Object.entries(settingsData)) {
        const [setting] = await db
          .insert(settings)
          .values({ key, value: String(value) })
          .onConflictDoUpdate({
            target: settings.key,
            set: { value: String(value) }
          })
          .returning();
        results.push(setting);
      }

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Google Calendar integration endpoints
  app.post("/api/google/test-connection", async (req, res) => {
    try {
      // This would implement actual Google Calendar API testing
      // For demo purposes, we'll simulate success
      res.json({ message: "Google Calendar connection successful" });
    } catch (error) {
      res.status(500).json({ message: "Failed to connect to Google Calendar" });
    }
  });

  app.post("/api/google/sync-meeting", async (req, res) => {
    try {
      const { meetingId } = req.body;
      // This would implement actual Google Calendar event creation
      // For demo purposes, we'll simulate success
      res.json({ 
        message: "Meeting synced to Google Calendar",
        googleEventId: `event_${meetingId}_${Date.now()}`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync meeting to Google Calendar" });
    }
  });

  // Notification testing endpoints
  app.post("/api/notifications/test-email", async (req, res) => {
    try {
      // This would implement actual email sending
      // For demo purposes, we'll simulate success
      res.json({ message: "Test email sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  // Dashboard statistics endpoints
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const totalMembers = await storage.getTeamMembers();
      const totalMeetings = await storage.getMeetings();
      const unreadNotifications = await db.select().from(notifications).where(eq(notifications.isRead, false));
      
      res.json({
        totalMembers: totalMembers.length,
        totalMeetings: totalMeetings.length,
        unreadNotifications: unreadNotifications.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
