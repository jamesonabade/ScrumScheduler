# Scrum Team Schedule Management System

## Overview

This is a comprehensive full-stack schedule management application built for Scrum teams with React, Express, and PostgreSQL. The system manages team member schedules, visualizes time overlaps, and generates intelligent meeting suggestions. It features an interactive timeline interface with drag-and-drop functionality, notifications system, Google Calendar integration, and a complete dashboard for team management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing with sidebar navigation
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming and team color coding
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with comprehensive CRUD operations
- **Database**: PostgreSQL with Drizzle ORM and automatic migrations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Data Seeding**: Automatic database population with realistic team data
- **Integration APIs**: Google Calendar and email notification endpoints

### Key Features Implemented

#### Core Functionality
- **Interactive Timeline**: Drag-and-drop schedule editing with time precision
- **Team Management**: Full CRUD for team members with color-coded visualization
- **Schedule Blocks**: Work periods, lunch breaks, and custom intervals
- **Meeting Management**: Automated scheduling for Daily, Review/Retro, and Planning
- **Overlap Detection**: Real-time calculation of team availability windows

#### Dashboard & Analytics
- **Team Dashboard**: Overview of team activity, metrics, and weekly statistics
- **Progress Tracking**: Visual representation of schedule coverage
- **Activity Feed**: Recent system changes and updates
- **Quick Actions**: Meeting suggestions and instant scheduling

#### Notifications System
- **Real-time Notifications**: Meeting reminders and schedule change alerts
- **Email Integration**: SMTP configuration for automated notifications
- **Notification Management**: Mark as read/unread, filtering, and deletion
- **Types**: Meeting reminders and schedule change notifications

#### Settings & Configuration
- **System Settings**: Company information, work hours, meeting durations
- **Google Calendar Integration**: API credentials and sync configuration
- **Email Notifications**: SMTP settings and test functionality
- **Advanced Configuration**: System status and technical information

#### Data Models
- **Team Members**: Enhanced with email, position, timezone, and status
- **Schedule Blocks**: Work periods with descriptions and types
- **Meetings**: Full meeting management with Google Calendar sync
- **Notifications**: Comprehensive notification system
- **Settings**: Configurable system parameters

## Navigation & User Experience

### Multi-Page Application
- **Dashboard**: Team overview, statistics, and activity feed
- **Schedule**: Interactive timeline with team member schedules
- **Notifications**: Notification center with filtering and management
- **Settings**: System configuration and integration setup

### Responsive Design
- **Sidebar Navigation**: Persistent navigation with active state indicators
- **Mobile Support**: Responsive design for all screen sizes
- **Color Coding**: Consistent team member colors throughout the application
- **Interactive Elements**: Drag-and-drop, context menus, and real-time updates

## Data Flow & Integration

1. **Database Initialization**: Automatic seeding with realistic team data from whiteboard
2. **Schedule Management**: Create, edit, and visualize team schedules with drag-and-drop
3. **Overlap Calculation**: Real-time analysis of team availability windows
4. **Meeting Suggestions**: Intelligent algorithm for optimal meeting times
5. **Notification System**: Automated alerts for meetings and schedule changes
6. **Google Calendar Sync**: Integration for meeting synchronization
7. **Dashboard Analytics**: Real-time metrics and team activity visualization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development
- File-based JSON storage for rapid prototyping
- Vite development server with hot reload
- TypeScript compilation in watch mode
- Automatic database schema synchronization

### Production
- PostgreSQL database with Drizzle migrations
- Static asset serving through Express
- Environment-based configuration
- Production build optimization with Vite

### Database Setup
- Drizzle configuration for PostgreSQL
- Automatic migration generation
- Schema validation with Zod
- Connection pooling for performance

## Changelog
- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.