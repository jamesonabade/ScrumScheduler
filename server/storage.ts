import { teamMembers, scheduleBlocks, meetings, type TeamMember, type InsertTeamMember, type ScheduleBlock, type InsertScheduleBlock, type Meeting, type InsertMeeting, type TeamMemberWithSchedules } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Team Members
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  
  // Schedule Blocks
  getScheduleBlocks(): Promise<ScheduleBlock[]>;
  getScheduleBlocksByMemberId(memberId: number): Promise<ScheduleBlock[]>;
  getScheduleBlocksByDay(dayOfWeek: string): Promise<ScheduleBlock[]>;
  createScheduleBlock(block: InsertScheduleBlock): Promise<ScheduleBlock>;
  updateScheduleBlock(id: number, block: Partial<InsertScheduleBlock>): Promise<ScheduleBlock>;
  deleteScheduleBlock(id: number): Promise<void>;
  
  // Meetings
  getMeetings(): Promise<Meeting[]>;
  getMeetingsByDay(dayOfWeek: string): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting>;
  deleteMeeting(id: number): Promise<void>;
  
  // Combined data
  getTeamMembersWithSchedules(dayOfWeek?: string): Promise<TeamMemberWithSchedules[]>;
}

export class DatabaseStorage implements IStorage {
  async getTeamMembers(): Promise<TeamMember[]> {
    const result = await db.select().from(teamMembers).where(eq(teamMembers.isActive, true));
    return result;
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member || undefined;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return newMember;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updatedMember] = await db
      .update(teamMembers)
      .set(member)
      .where(eq(teamMembers.id, id))
      .returning();
    return updatedMember;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db
      .update(teamMembers)
      .set({ isActive: false })
      .where(eq(teamMembers.id, id));
  }

  async getScheduleBlocks(): Promise<ScheduleBlock[]> {
    const result = await db.select().from(scheduleBlocks);
    return result;
  }

  async getScheduleBlocksByMemberId(memberId: number): Promise<ScheduleBlock[]> {
    const result = await db.select().from(scheduleBlocks).where(eq(scheduleBlocks.memberId, memberId));
    return result;
  }

  async getScheduleBlocksByDay(dayOfWeek: string): Promise<ScheduleBlock[]> {
    const result = await db.select().from(scheduleBlocks).where(eq(scheduleBlocks.dayOfWeek, dayOfWeek));
    return result;
  }

  async createScheduleBlock(block: InsertScheduleBlock): Promise<ScheduleBlock> {
    const [newBlock] = await db
      .insert(scheduleBlocks)
      .values(block)
      .returning();
    return newBlock;
  }

  async updateScheduleBlock(id: number, block: Partial<InsertScheduleBlock>): Promise<ScheduleBlock> {
    const [updatedBlock] = await db
      .update(scheduleBlocks)
      .set(block)
      .where(eq(scheduleBlocks.id, id))
      .returning();
    return updatedBlock;
  }

  async deleteScheduleBlock(id: number): Promise<void> {
    await db
      .delete(scheduleBlocks)
      .where(eq(scheduleBlocks.id, id));
  }

  async getMeetings(): Promise<Meeting[]> {
    const result = await db.select().from(meetings);
    return result;
  }

  async getMeetingsByDay(dayOfWeek: string): Promise<Meeting[]> {
    const result = await db.select().from(meetings).where(eq(meetings.dayOfWeek, dayOfWeek));
    return result;
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const [newMeeting] = await db
      .insert(meetings)
      .values(meeting)
      .returning();
    return newMeeting;
  }

  async updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting> {
    const [updatedMeeting] = await db
      .update(meetings)
      .set(meeting)
      .where(eq(meetings.id, id))
      .returning();
    return updatedMeeting;
  }

  async deleteMeeting(id: number): Promise<void> {
    await db
      .delete(meetings)
      .where(eq(meetings.id, id));
  }

  async getTeamMembersWithSchedules(dayOfWeek?: string): Promise<TeamMemberWithSchedules[]> {
    const members = await this.getTeamMembers();
    const allBlocks = await this.getScheduleBlocks();
    
    return members.map(member => ({
      ...member,
      schedules: allBlocks.filter(block => 
        block.memberId === member.id && 
        (!dayOfWeek || block.dayOfWeek === dayOfWeek)
      ),
    }));
  }
}

export const storage = new DatabaseStorage();