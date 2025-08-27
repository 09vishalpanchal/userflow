# ServiceConnect Platform

## Overview

ServiceConnect is a web-based marketplace platform that connects customers with local service providers. The system enables customers to find and book various services (cleaning, repairs, beauty, tech support, etc.) while allowing service providers to list their services and manage their business through the platform. The application features a dual-sided marketplace with distinct user experiences for customers, service providers, and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for development and bundling
- **Component System**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite integration
- **Error Handling**: Centralized error middleware with status code mapping

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Connection**: Connection pooling via @neondatabase/serverless

### Authentication & Authorization
- **Authentication Method**: Phone number + OTP verification
- **User Types**: Customer, Provider, Admin with role-based access
- **Session Management**: Express sessions with PostgreSQL storage
- **OTP System**: Time-limited verification codes with expiration tracking

### Data Models
- **Users**: Core user entity with phone verification and user type classification
- **Profiles**: Separate customer and provider profiles with location data
- **Jobs**: Service request system with status tracking
- **Wallet System**: Credit-based payment system for unlocking job details
- **Transactions**: Financial transaction logging for wallet operations

### File Structure
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Shared Types**: Common TypeScript definitions and database schema
- **Asset Management**: Centralized asset handling with Vite aliases
- **Configuration**: Unified TypeScript configuration across all packages

## External Dependencies

### Core Technologies
- **React Ecosystem**: React, React DOM, React Query for frontend
- **UI Components**: Radix UI primitives for accessible components
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Validation**: Zod for runtime type validation and schema generation

### Development Tools
- **Build System**: Vite with React plugin and error overlay
- **Styling**: Tailwind CSS with PostCSS processing
- **TypeScript**: Full TypeScript support with strict configuration
- **Code Quality**: ESLint integration via Vite plugins

### Production Services
- **Database Hosting**: Neon serverless PostgreSQL
- **SMS Gateway**: SMS service integration for OTP delivery (implementation pending)
- **File Storage**: Local asset serving with production CDN capability
- **Session Storage**: PostgreSQL-backed session management

### Utility Libraries
- **Date Handling**: date-fns for date manipulation
- **Styling Utilities**: clsx and tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod resolvers for form validation