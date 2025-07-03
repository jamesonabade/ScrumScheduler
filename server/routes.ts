import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeamMemberSchema, insertScheduleBlockSchema, insertMeetingSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
