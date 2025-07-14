# Jin-an County Campaign Application

## Overview

This is a full-stack web application for a political campaign opposing the construction of a wooden observation tower in Jin-an County, South Korea. The app enables citizens to sign petitions, propose policies, view resources, and track campaign progress. Built with React (frontend), Express.js (backend), PostgreSQL (database), and Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Monorepo Structure
The application follows a monorepo pattern with clear separation between client, server, and shared code:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Common types, schemas, and utilities

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript, ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: Wouter (lightweight client-side routing)
- **Authentication**: Express sessions with PostgreSQL storage

## Key Components

### Frontend Architecture
- **Component-based**: Modular React components in `client/src/components/`
- **UI System**: shadcn/ui components built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **PWA Ready**: Service worker, manifest.json, and offline capabilities
- **Korean Language**: Fully localized for Korean users

### Backend Architecture
- **RESTful API**: Express.js routes in `server/routes.ts`
- **Session-based Auth**: Express sessions with PostgreSQL storage
- **Database Layer**: Abstracted storage interface in `server/storage.ts`
- **Type Safety**: Shared TypeScript schemas between client and server

### Database Schema
Core entities include:
- **Users**: Basic user information (name, phone)
- **Signatures**: Petition signatures linked to users
- **Policies**: User-submitted policy proposals with categories
- **Policy Supports**: Many-to-many relationship for policy endorsements
- **Notices**: Administrative announcements
- **Resources**: Documents, news articles, and videos

### Authentication System
- **Phone-based Login**: Users authenticate with name and phone number
- **Session Management**: Express sessions stored in PostgreSQL
- **Authorization Middleware**: Protects sensitive endpoints

## Data Flow

1. **User Registration/Login**: Phone number + name → Session creation
2. **Petition Signing**: Authenticated users can sign once → Updates statistics
3. **Policy Proposals**: Users submit categorized policy ideas → Community voting
4. **Resource Viewing**: Public access to documents, news, and videos
5. **Real-time Stats**: Live updates of signatures, policies, and engagement

### State Management
- **Server State**: TanStack Query manages API calls and caching
- **Client State**: React hooks for local component state
- **Form State**: React Hook Form with Zod validation

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **express-session**: Session management
- **zod**: Runtime type validation

### UI/UX Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **drizzle-kit**: Database migrations
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public/`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: Local development with hot reload
- **Production**: Optimized builds with environment-specific configs
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Sessions**: Configurable session secret

### Deployment Targets
- **Replit**: Primary deployment platform with built-in database
- **Static Assets**: PWA assets, icons, and service worker
- **Database**: Neon PostgreSQL for production data storage

### Performance Considerations
- **Code Splitting**: Vite automatically splits code for optimal loading
- **Caching**: Service worker caches static assets and API responses
- **Image Optimization**: PWA icons in multiple sizes
- **Bundle Size**: Selective imports and tree shaking reduce bundle size

## Recent Changes (July 14, 2025)

### Complete Database-Driven CMS Implementation
- **Full Text Database Migration**: All webpage text content moved from hardcoded to database-driven
- **Component Database Integration**: Hero, motivation, header, footer, navigation sections now read from database
- **Content Initialization System**: Added "콘텐츠 초기화" button in admin panel for setting up default content
- **Dynamic Content Management**: All text can be edited in CMS and immediately reflects on webpage
- **Content Workflow**: Database storage → CMS loading → editing → saving back to database → webpage update

### Admin Panel Signature Restriction
- **Signature Data Protection**: Removed all signature editing capabilities from admin CMS
- **Read-only Statistics**: Signature count is now displayed as read-only statistic only
- **Content Filtering**: Signature-related content cannot be created or edited via web content management
- **Automatic Calculation**: All signature statistics are automatically calculated from database
- **User Intent**: Ensures signature campaign data integrity and prevents unauthorized modifications

### Real-time CMS Synchronization Fix (July 14, 2025)
- **API Integration Fix**: Resolved fetch method parameter order issue in apiRequest function
- **Cache Management**: Implemented proper staleTime: 0 for immediate fresh data fetching
- **Query Invalidation**: Enhanced cache invalidation with comprehensive refetch mechanisms
- **Live Updates**: CMS modifications now instantly reflect on webpage without browser refresh
- **Data Flow Optimization**: Streamlined database → API → frontend cache → UI rendering pipeline

### Survey System UX Enhancement (July 14, 2025)
- **Smart Login Flow**: Survey submission now automatically triggers login modal when user is not authenticated
- **Seamless Experience**: After successful login, pending survey submission continues automatically
- **Enhanced AuthModal**: Added onSuccess callback support for post-login actions
- **User State Detection**: Proactive authentication check before submission attempt
- **Improved Error Handling**: Replaced error messages with intuitive login prompts

### Policy Creation System Fix (July 14, 2025)
- **API Request Function Modernization**: Updated apiRequest function signature to (method, url, data) format
- **Authentication Flow Integration**: Removed blocking requireAuth middleware, replaced with proactive login modal flow
- **Seamless User Experience**: Policy creation → login prompt → automatic policy modal reopening after successful authentication
- **Error Handling Enhancement**: Comprehensive error logging and user-friendly feedback throughout policy creation process
- **Complete Workflow Resolution**: Fixed login infinite loop, API parameter issues, and authentication state management