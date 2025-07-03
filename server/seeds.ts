import { db } from "./db";
import { teamMembers, scheduleBlocks, meetings, settings, notifications } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Seed team members with the names from the whiteboard
    const members = await db.insert(teamMembers).values([
      { 
        name: 'Higor', 
        color: 'blue', 
        email: 'higor@scrum-team.com',
        position: 'Product Owner',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
      { 
        name: 'Vitor', 
        color: 'green', 
        email: 'vitor@scrum-team.com',
        position: 'Scrum Master',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
      { 
        name: 'Marcos', 
        color: 'orange', 
        email: 'marcos@scrum-team.com',
        position: 'Senior Developer',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
      { 
        name: 'Jameson', 
        color: 'purple', 
        email: 'jameson@scrum-team.com',
        position: 'Frontend Developer',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
      { 
        name: 'Ronaldo', 
        color: 'teal', 
        email: 'ronaldo@scrum-team.com',
        position: 'Backend Developer',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
      { 
        name: 'Murilo', 
        color: 'yellow', 
        email: 'murilo@scrum-team.com',
        position: 'Full Stack Developer',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
      { 
        name: 'Dárcio', 
        color: 'pink', 
        email: 'darcio@scrum-team.com',
        position: 'DevOps Engineer',
        timezone: 'America/Sao_Paulo',
        isActive: true 
      },
    ]).returning();

    // Create realistic schedule blocks based on the whiteboard image
    const schedules = [
      // Monday schedules based on the image
      { memberId: members[0].id, dayOfWeek: 'monday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Sprint Planning & Development' },
      { memberId: members[0].id, dayOfWeek: 'monday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[1].id, dayOfWeek: 'monday', startTime: '09:00', endTime: '18:00', type: 'work', description: 'Team Facilitation & Meetings' },
      { memberId: members[1].id, dayOfWeek: 'monday', startTime: '13:00', endTime: '14:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[2].id, dayOfWeek: 'monday', startTime: '08:30', endTime: '17:30', type: 'work', description: 'Code Review & Development' },
      { memberId: members[2].id, dayOfWeek: 'monday', startTime: '12:30', endTime: '13:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[3].id, dayOfWeek: 'monday', startTime: '09:30', endTime: '18:30', type: 'work', description: 'UI Development & Testing' },
      { memberId: members[3].id, dayOfWeek: 'monday', startTime: '14:00', endTime: '15:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[4].id, dayOfWeek: 'monday', startTime: '07:30', endTime: '16:30', type: 'work', description: 'API Development & Documentation' },
      { memberId: members[4].id, dayOfWeek: 'monday', startTime: '11:30', endTime: '12:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[5].id, dayOfWeek: 'monday', startTime: '10:00', endTime: '19:00', type: 'work', description: 'Full Stack Development' },
      { memberId: members[5].id, dayOfWeek: 'monday', startTime: '14:30', endTime: '15:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[6].id, dayOfWeek: 'monday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Infrastructure & Deployment' },
      { memberId: members[6].id, dayOfWeek: 'monday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },

      // Tuesday schedules
      { memberId: members[0].id, dayOfWeek: 'tuesday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Product Backlog Review' },
      { memberId: members[0].id, dayOfWeek: 'tuesday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[1].id, dayOfWeek: 'tuesday', startTime: '09:00', endTime: '18:00', type: 'work', description: 'Sprint Review Preparation' },
      { memberId: members[1].id, dayOfWeek: 'tuesday', startTime: '13:00', endTime: '14:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[2].id, dayOfWeek: 'tuesday', startTime: '08:30', endTime: '17:30', type: 'work', description: 'Feature Development' },
      { memberId: members[2].id, dayOfWeek: 'tuesday', startTime: '12:30', endTime: '13:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[3].id, dayOfWeek: 'tuesday', startTime: '09:30', endTime: '18:30', type: 'work', description: 'Component Development' },
      { memberId: members[3].id, dayOfWeek: 'tuesday', startTime: '14:00', endTime: '15:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[4].id, dayOfWeek: 'tuesday', startTime: '07:30', endTime: '16:30', type: 'work', description: 'Database Optimization' },
      { memberId: members[4].id, dayOfWeek: 'tuesday', startTime: '11:30', endTime: '12:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[5].id, dayOfWeek: 'tuesday', startTime: '10:00', endTime: '19:00', type: 'work', description: 'Integration Testing' },
      { memberId: members[5].id, dayOfWeek: 'tuesday', startTime: '14:30', endTime: '15:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[6].id, dayOfWeek: 'tuesday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'CI/CD Pipeline Maintenance' },
      { memberId: members[6].id, dayOfWeek: 'tuesday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },

      // Wednesday schedules
      { memberId: members[0].id, dayOfWeek: 'wednesday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Stakeholder Meetings' },
      { memberId: members[0].id, dayOfWeek: 'wednesday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[1].id, dayOfWeek: 'wednesday', startTime: '09:00', endTime: '18:00', type: 'work', description: 'Team Retrospective' },
      { memberId: members[1].id, dayOfWeek: 'wednesday', startTime: '13:00', endTime: '14:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[2].id, dayOfWeek: 'wednesday', startTime: '08:30', endTime: '17:30', type: 'work', description: 'Code Architecture Review' },
      { memberId: members[2].id, dayOfWeek: 'wednesday', startTime: '12:30', endTime: '13:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[3].id, dayOfWeek: 'wednesday', startTime: '09:30', endTime: '18:30', type: 'work', description: 'User Experience Testing' },
      { memberId: members[3].id, dayOfWeek: 'wednesday', startTime: '14:00', endTime: '15:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[4].id, dayOfWeek: 'wednesday', startTime: '07:30', endTime: '16:30', type: 'work', description: 'Performance Optimization' },
      { memberId: members[4].id, dayOfWeek: 'wednesday', startTime: '11:30', endTime: '12:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[5].id, dayOfWeek: 'wednesday', startTime: '10:00', endTime: '19:00', type: 'work', description: 'Bug Fixes & Refactoring' },
      { memberId: members[5].id, dayOfWeek: 'wednesday', startTime: '14:30', endTime: '15:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[6].id, dayOfWeek: 'wednesday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Security Audits' },
      { memberId: members[6].id, dayOfWeek: 'wednesday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },

      // Thursday schedules
      { memberId: members[0].id, dayOfWeek: 'thursday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Product Demo Preparation' },
      { memberId: members[0].id, dayOfWeek: 'thursday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[1].id, dayOfWeek: 'thursday', startTime: '09:00', endTime: '18:00', type: 'work', description: 'Sprint Planning' },
      { memberId: members[1].id, dayOfWeek: 'thursday', startTime: '13:00', endTime: '14:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[2].id, dayOfWeek: 'thursday', startTime: '08:30', endTime: '17:30', type: 'work', description: 'Technical Documentation' },
      { memberId: members[2].id, dayOfWeek: 'thursday', startTime: '12:30', endTime: '13:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[3].id, dayOfWeek: 'thursday', startTime: '09:30', endTime: '18:30', type: 'work', description: 'Design System Updates' },
      { memberId: members[3].id, dayOfWeek: 'thursday', startTime: '14:00', endTime: '15:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[4].id, dayOfWeek: 'thursday', startTime: '07:30', endTime: '16:30', type: 'work', description: 'Microservices Development' },
      { memberId: members[4].id, dayOfWeek: 'thursday', startTime: '11:30', endTime: '12:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[5].id, dayOfWeek: 'thursday', startTime: '10:00', endTime: '19:00', type: 'work', description: 'E2E Testing' },
      { memberId: members[5].id, dayOfWeek: 'thursday', startTime: '14:30', endTime: '15:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[6].id, dayOfWeek: 'thursday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Monitoring & Alerts' },
      { memberId: members[6].id, dayOfWeek: 'thursday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },

      // Friday schedules
      { memberId: members[0].id, dayOfWeek: 'friday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Sprint Review & Demo' },
      { memberId: members[0].id, dayOfWeek: 'friday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[1].id, dayOfWeek: 'friday', startTime: '09:00', endTime: '18:00', type: 'work', description: 'Sprint Retrospective' },
      { memberId: members[1].id, dayOfWeek: 'friday', startTime: '13:00', endTime: '14:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[2].id, dayOfWeek: 'friday', startTime: '08:30', endTime: '17:30', type: 'work', description: 'Knowledge Sharing' },
      { memberId: members[2].id, dayOfWeek: 'friday', startTime: '12:30', endTime: '13:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[3].id, dayOfWeek: 'friday', startTime: '09:30', endTime: '18:30', type: 'work', description: 'UI/UX Improvements' },
      { memberId: members[3].id, dayOfWeek: 'friday', startTime: '14:00', endTime: '15:00', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[4].id, dayOfWeek: 'friday', startTime: '07:30', endTime: '16:30', type: 'work', description: 'System Maintenance' },
      { memberId: members[4].id, dayOfWeek: 'friday', startTime: '11:30', endTime: '12:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[5].id, dayOfWeek: 'friday', startTime: '10:00', endTime: '19:00', type: 'work', description: 'Release Preparation' },
      { memberId: members[5].id, dayOfWeek: 'friday', startTime: '14:30', endTime: '15:30', type: 'lunch', description: 'Almoço' },
      
      { memberId: members[6].id, dayOfWeek: 'friday', startTime: '08:00', endTime: '17:00', type: 'work', description: 'Infrastructure Review' },
      { memberId: members[6].id, dayOfWeek: 'friday', startTime: '12:00', endTime: '13:00', type: 'lunch', description: 'Almoço' },
    ];

    await db.insert(scheduleBlocks).values(schedules);

    // Create sample meetings
    await db.insert(meetings).values([
      {
        type: 'daily',
        dayOfWeek: 'monday',
        startTime: '09:00',
        endTime: '09:15',
        participants: ['Higor', 'Vitor', 'Marcos', 'Jameson', 'Ronaldo', 'Murilo', 'Dárcio'],
        description: 'Daily Standup - Sprint Progress',
      },
      {
        type: 'planning',
        dayOfWeek: 'tuesday',
        startTime: '14:00',
        endTime: '16:00',
        participants: ['Higor', 'Vitor', 'Marcos', 'Jameson'],
        description: 'Sprint Planning - Next Sprint Goals',
      },
      {
        type: 'review',
        dayOfWeek: 'friday',
        startTime: '15:00',
        endTime: '16:30',
        participants: ['Higor', 'Vitor', 'Marcos', 'Jameson', 'Ronaldo', 'Murilo'],
        description: 'Sprint Review & Retrospective',
      },
    ]);

    // Create default settings
    await db.insert(settings).values([
      {
        key: 'google_calendar_enabled',
        value: 'false',
        description: 'Enable Google Calendar integration'
      },
      {
        key: 'notification_enabled',
        value: 'true',
        description: 'Enable email notifications'
      },
      {
        key: 'default_meeting_duration',
        value: '30',
        description: 'Default meeting duration in minutes'
      },
      {
        key: 'work_hours_start',
        value: '07:00',
        description: 'Default work hours start time'
      },
      {
        key: 'work_hours_end',
        value: '19:00',
        description: 'Default work hours end time'
      },
      {
        key: 'company_name',
        value: 'Scrum Team',
        description: 'Company or team name'
      }
    ]);

    // Create sample notifications
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await db.insert(notifications).values([
      {
        type: 'meeting_reminder',
        title: 'Lembrete: Daily Standup',
        message: 'Sua reunião diária começará em 15 minutos às 09:00. Prepare-se para compartilhar suas atualizações.',
        targetDate: today.toISOString().split('T')[0],
        targetTime: '09:00',
        isRead: false,
        createdAt: today.toISOString(),
      },
      {
        type: 'schedule_change',
        title: 'Alteração de Cronograma',
        message: 'Marcos atualizou seu horário de trabalho para esta semana. Novos horários: 08:30 - 17:30.',
        targetDate: today.toISOString().split('T')[0],
        targetTime: '14:30',
        isRead: false,
        createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: 'meeting_reminder',
        title: 'Sprint Review Agendada',
        message: 'Nova reunião de revisão foi criada para sexta-feira às 15:00. Prepare a demonstração dos entregáveis.',
        targetDate: tomorrow.toISOString().split('T')[0],
        targetTime: '15:00',
        isRead: true,
        createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: 'schedule_change',
        title: 'Sistema Atualizado',
        message: 'O sistema de cronograma foi atualizado com novas funcionalidades. Confira as configurações.',
        targetDate: today.toISOString().split('T')[0],
        targetTime: '10:00',
        isRead: true,
        createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}