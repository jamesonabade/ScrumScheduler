# Schedule Management System

## Overview

This is a full-stack schedule management application built with React, Express, and PostgreSQL. The system allows teams to manage member schedules, visualize time overlaps, and generate meeting suggestions based on availability. It features an interactive timeline interface for drag-and-drop schedule editing and supports multiple team members with color-coded visualization.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with CRUD operations
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store
- **Development**: Hot reload with Vite integration

### Key Components

#### Data Models
- **Team Members**: Store team member information with color coding
- **Schedule Blocks**: Define work periods, breaks, and lunch times
- **Meetings**: Track scheduled meetings with participant lists
- **Overlaps**: Calculated time periods where multiple team members are available

#### Frontend Features
- Interactive timeline with drag-and-drop functionality
- Real-time schedule overlap visualization
- Context menu for quick schedule actions
- Responsive design with mobile support
- Meeting suggestion algorithm
- Color-coded team member visualization

#### Backend Features
- File-based storage fallback for development
- PostgreSQL integration for production
- CRUD operations for all entities
- Schedule overlap calculation
- Meeting suggestion generation
- Input validation with Zod schemas

## Data Flow

1. **Schedule Creation**: Users can add team members and define their work schedules
2. **Visual Timeline**: Schedules are displayed on an interactive timeline (7 AM - 7 PM)
3. **Overlap Detection**: System calculates overlapping time periods between team members
4. **Meeting Suggestions**: Algorithm generates optimal meeting times based on availability
5. **Real-time Updates**: Changes are immediately reflected across the interface

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