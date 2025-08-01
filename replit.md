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

### Survey Content Management System Implementation (July 14, 2025)
- **Survey Management Tab**: Added dedicated "여론조사 관리" tab in admin panel with grid-cols-5 layout
- **Survey Content Database Migration**: Converted all hardcoded survey text to database-driven content system
- **Content Initialization API**: Created `/api/admin/initialize-survey-content` endpoint for setting up default survey text
- **18 Survey Text Elements**: Implemented database storage for buttons, labels, titles, descriptions, error messages
- **Real-time Content Updates**: Survey page texts now dynamically load from database via individual API endpoints
- **CMS Integration**: All survey content editable through admin CMS with immediate webpage reflection
- **Content Categories**: Error states, results view, completion state, form navigation, authentication prompts

### Complete Survey System Redesign (July 14, 2025)
- **Elder-Friendly Questions**: Completely rewrote all 12 survey questions replacing technical terms ("앱/웹" → "핸드폰이나 컴퓨터")
- **Content Focus Shift**: Changed from generic digital survey questions to Jinan County wooden observation tower specific questions
- **Question Categories**: Added questions about tower construction opinion, opposition reasons, priority projects, digital literacy
- **Database-Driven Text System**: All UI text (25+ elements) now stored in database and editable via CMS
- **Complete Content Migration**: Every visible text element in survey section now reads from web_content table
- **Real-time CMS Updates**: Survey page content immediately reflects changes made in admin panel
- **Elderly Accessibility**: Improved question clarity and terminology for senior citizen understanding

### Survey Authentication Flow Fix (July 14, 2025)
- **Authentication State Management**: Fixed useAuth hook structure issue preventing proper auth state checking
- **Login Modal Integration**: Resolved infinite login modal issue by correcting auth object destructuring
- **Error Handling Enhancement**: Improved 401 error handling with proper auth state validation
- **Conditional Logic Validation**: Confirmed 8-step survey with question 2 conditional display working correctly
- **Submit Flow Optimization**: Enhanced submission process with detailed logging for debugging
- **User Experience Improvement**: Login required flow now works seamlessly - shows modal when needed, submits when authenticated

### Critical Session Management Fix (July 14, 2025)
- **PostgreSQL Session Store Migration**: Replaced MemoryStore with connect-pg-simple for persistent session storage
- **Browser-Server Session Synchronization Issue**: Identified persistent cookie/session ID mismatch preventing authentication
- **Session Cleanup Implementation**: Added automatic invalid session destruction and cookie clearing
- **Force Page Reload Strategy**: Implemented complete browser state reset after successful login to ensure fresh session
- **Cookie Management Enhancement**: Added comprehensive cookie clearing and domain-specific session handling

### PWA Enhancement Implementation (July 15, 2025)
- **PWA Install Banner**: Added prominent install banner with automatic detection of install prompt events
- **PWA Status Indicator**: Implemented real-time online/offline status and update notifications
- **Header Install Button**: Added responsive PWA install button in header with desktop/mobile variants
- **Service Worker Registration**: Enhanced service worker with comprehensive caching and background sync
- **Progressive Enhancement**: Install banner shows for 5 seconds, dismissible, with manual install instructions
- **App Icon System**: Created SVG-based app icons with proper manifest.json configuration for all device sizes

### Survey Content Update to Original Reference Material (July 15, 2025)
- **8-Question Survey System**: Reduced from 12 to 8 questions based on provided reference document
- **Elder-Friendly Language**: Changed "앱/웹" to "휴대폰이나 컴퓨터" throughout all survey questions
- **Multiple Choice Explanations**: Added "(여러 개 선택 가능)" helper text for multiple choice questions
- **No Essay Questions**: Removed all text input questions to focus on multiple choice format
- **CMS Survey Content Management**: Added survey content initialization and management in admin panel
- **Database-Driven Survey Text**: All survey UI text now stored in database and editable via CMS

### PWA Install Guide Enhancement (July 15, 2025)
- **Comprehensive Install Guide**: Added detailed PWA installation section with step-by-step instructions for iOS and Android
- **Platform-Specific Instructions**: Separate installation guides for iPhone (Safari) and Android (Chrome) with visual indicators
- **Benefits Explanation**: Clear explanation of PWA benefits including offline access, faster loading, and home screen shortcuts
- **Enhanced Banner Messages**: Improved PWA install banner with campaign-specific messaging and better user guidance
- **Navigation Integration**: Added "앱 설치" tab to main navigation for easy access to installation guide