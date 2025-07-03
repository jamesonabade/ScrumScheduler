import { teamMembers, scheduleBlocks, meetings, type TeamMember, type InsertTeamMember, type ScheduleBlock, type InsertScheduleBlock, type Meeting, type InsertMeeting, type TeamMemberWithSchedules } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

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

interface StorageData {
  teamMembers: TeamMember[];
  scheduleBlocks: ScheduleBlock[];
  meetings: Meeting[];
  nextIds: {
    teamMembers: number;
    scheduleBlocks: number;
    meetings: number;
  };
}

export class FileStorage implements IStorage {
  private dataPath: string;
  private data: StorageData | null = null;

  constructor() {
    this.dataPath = path.resolve(process.cwd(), 'data', 'schedules.json');
  }

  private async loadData(): Promise<StorageData> {
    if (this.data) return this.data;

    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf-8');
      this.data = JSON.parse(fileContent);
    } catch (error) {
      // Initialize with default data if file doesn't exist
      this.data = {
        teamMembers: [
          { id: 1, name: 'Higor', color: 'blue', isActive: true },
          { id: 2, name: 'Vitor', color: 'green', isActive: true },
          { id: 3, name: 'Marcos', color: 'orange', isActive: true },
          { id: 4, name: 'Jameson', color: 'purple', isActive: true },
          { id: 5, name: 'Ronaldo', color: 'teal', isActive: true },
          { id: 6, name: 'Murilo', color: 'yellow', isActive: true },
          { id: 7, name: 'Dárcio', color: 'pink', isActive: true },
        ],
        scheduleBlocks: [
          { id: 1, memberId: 1, dayOfWeek: 'monday', startTime: '08:00', endTime: '17:00', type: 'work' },
          { id: 2, memberId: 1, dayOfWeek: 'monday', startTime: '12:00', endTime: '13:00', type: 'lunch' },
          { id: 3, memberId: 2, dayOfWeek: 'monday', startTime: '09:00', endTime: '18:00', type: 'work' },
          { id: 4, memberId: 2, dayOfWeek: 'monday', startTime: '13:00', endTime: '14:00', type: 'lunch' },
          { id: 5, memberId: 3, dayOfWeek: 'monday', startTime: '10:00', endTime: '17:00', type: 'work' },
          { id: 6, memberId: 4, dayOfWeek: 'monday', startTime: '11:00', endTime: '17:00', type: 'work' },
          { id: 7, memberId: 5, dayOfWeek: 'monday', startTime: '07:30', endTime: '15:30', type: 'work' },
          { id: 8, memberId: 7, dayOfWeek: 'monday', startTime: '12:30', endTime: '19:00', type: 'work' },
        ],
        meetings: [],
        nextIds: {
          teamMembers: 8,
          scheduleBlocks: 9,
          meetings: 1,
        },
      };
      await this.saveData();
    }

    return this.data;
  }

  private async saveData(): Promise<void> {
    if (!this.data) return;
    
    try {
      await fs.mkdir(path.dirname(this.dataPath), { recursive: true });
      await fs.writeFile(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Failed to save data:', error);
      throw new Error('Failed to save schedule data');
    }
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    const data = await this.loadData();
    return data.teamMembers.filter(member => member.isActive);
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const data = await this.loadData();
    return data.teamMembers.find(member => member.id === id && member.isActive);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const data = await this.loadData();
    const newMember: TeamMember = {
      ...member,
      id: data.nextIds.teamMembers++,
      isActive: true,
    };
    data.teamMembers.push(newMember);
    await this.saveData();
    return newMember;
  }

  async updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const data = await this.loadData();
    const index = data.teamMembers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    
    data.teamMembers[index] = { ...data.teamMembers[index], ...member };
    await this.saveData();
    return data.teamMembers[index];
  }

  async deleteTeamMember(id: number): Promise<void> {
    const data = await this.loadData();
    const index = data.teamMembers.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    
    data.teamMembers[index].isActive = false;
    await this.saveData();
  }

  // Schedule Blocks
  async getScheduleBlocks(): Promise<ScheduleBlock[]> {
    const data = await this.loadData();
    return data.scheduleBlocks;
  }

  async getScheduleBlocksByMemberId(memberId: number): Promise<ScheduleBlock[]> {
    const data = await this.loadData();
    return data.scheduleBlocks.filter(block => block.memberId === memberId);
  }

  async getScheduleBlocksByDay(dayOfWeek: string): Promise<ScheduleBlock[]> {
    const data = await this.loadData();
    return data.scheduleBlocks.filter(block => block.dayOfWeek === dayOfWeek);
  }

  async createScheduleBlock(block: InsertScheduleBlock): Promise<ScheduleBlock> {
    const data = await this.loadData();
    const newBlock: ScheduleBlock = {
      ...block,
      id: data.nextIds.scheduleBlocks++,
    };
    data.scheduleBlocks.push(newBlock);
    await this.saveData();
    return newBlock;
  }

  async updateScheduleBlock(id: number, block: Partial<InsertScheduleBlock>): Promise<ScheduleBlock> {
    const data = await this.loadData();
    const index = data.scheduleBlocks.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Schedule block not found');
    
    data.scheduleBlocks[index] = { ...data.scheduleBlocks[index], ...block };
    await this.saveData();
    return data.scheduleBlocks[index];
  }

  async deleteScheduleBlock(id: number): Promise<void> {
    const data = await this.loadData();
    const index = data.scheduleBlocks.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Schedule block not found');
    
    data.scheduleBlocks.splice(index, 1);
    await this.saveData();
  }

  // Meetings
  async getMeetings(): Promise<Meeting[]> {
    const data = await this.loadData();
    return data.meetings;
  }

  async getMeetingsByDay(dayOfWeek: string): Promise<Meeting[]> {
    const data = await this.loadData();
    return data.meetings.filter(meeting => meeting.dayOfWeek === dayOfWeek);
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const data = await this.loadData();
    const newMeeting: Meeting = {
      ...meeting,
      id: data.nextIds.meetings++,
    };
    data.meetings.push(newMeeting);
    await this.saveData();
    return newMeeting;
  }

  async updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting> {
    const data = await this.loadData();
    const index = data.meetings.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    
    data.meetings[index] = { ...data.meetings[index], ...meeting };
    await this.saveData();
    return data.meetings[index];
  }

  async deleteMeeting(id: number): Promise<void> {
    const data = await this.loadData();
    const index = data.meetings.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    
    data.meetings.splice(index, 1);
    await this.saveData();
  }

  // Combined data
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

export const storage = new FileStorage();
