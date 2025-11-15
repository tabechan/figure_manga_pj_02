# 魔法学園アドベンチャー - Manga Figure App

## Overview
This project is a Japanese manga and collectible figure companion app. It provides a comprehensive platform for manga readers and figure collectors to manage their collections, claim figure ownership via NFC/QR, lend books, purchase merchandise, and stay updated with events and news. The application aims to create an integrated experience for fans of Japanese manga and collectible figures.

## User Preferences
- Prefers existing Japanese React UI to be preserved
- Chose separated architecture (Option B: Vite + React frontend + Express backend)
- MVP scope: Email/Password authentication only (no Passkey yet)
- PostgreSQL chosen from start for better Replit compatibility

## System Architecture
The application uses a separated architecture with a React + TypeScript frontend and a Node.js + Express + PostgreSQL backend.

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.7
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 4.1.3
- **UI Components**: Radix UI, Lucide React
- **Animation**: Motion 11.15.0
- **State Management**: React Context API
- **Key Features**:
    - **UI/UX**: Custom Adobe Express figure images are integrated. Owned works display owned figure thumbnails, and unowned works show available figures. Detailed figure cards include volume information and purchase options. Natural Japanese terminology is used throughout the UI.
    - **Manga Viewer**: Real-time reading session management with heartbeat, loading, and error states.
    - **NFC/QR Claiming**: Secure transaction-based figure claiming system with URL parameter detection and automated claim transition.
    - **Content Display**: Unified `TopScreen` component combines owned works display and detailed work view, supporting API-driven content loading, compatible figures, volume lists, auto-purchase toggle, and review posting. `WorksScreen` and `WorkDetailScreen` manage series display, individual volume purchase, and review functionalities.

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.21.2
- **Language**: TypeScript 5.7.2
- **ORM**: Prisma 6.2.0
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Validation**: Zod 3.24.1
- **Core Features**:
    - **User Authentication**: JWT-based login with secure cookies, email/password.
    - **Figure Ownership**: API for scanning and claiming figure ownership, linking physical figures to digital content rights. Implements a transaction-based system to prevent URL parameter hijacking.
    - **Content Licensing**: Manages `ReadRights` (figure-based) and `VolumeOwnership` (direct purchase) to determine access to digital manga volumes.
    - **Manga Reading**: API endpoints for starting, heartbeating, and stopping reading sessions.
    - **Book Lending**: Functionality to generate QR/URLs for temporary lending of reading rights.
    - **Merchandise Store**: APIs for listing products, managing shopping carts, and purchasing items.
    - **Events & News**: Endpoints for listing and detailing events and news items.
    - **Security**: Passwords hashed with bcrypt, HTTPOnly cookies for auth tokens, CORS restrictions, input validation via Zod schemas, mandatory `JWT_SECRET`.

### Directory Structure
- `src/`: Frontend source (assets, components, context, lib, styles)
- `server/`: Backend source (api, middleware, lib, prisma, package.json)

### API Endpoints
- **Authentication**: `/api/auth` (register, login, logout, me)
- **Scan & Claim**: `/api/scan` (scan, claim, transaction)
- **Reading**: `/api/read` (start, heartbeat, stop)
- **Lending**: `/api/loan` (start, activate, end)
- **Goods**: `/api/goods` (products, cart)
- **News**: `/api/news`
- **Events**: `/api/events`

## External Dependencies
- **PostgreSQL**: Primary database for all application data, hosted by Replit.
- **Vite**: Frontend build tool.
- **React**: Frontend UI library.
- **Node.js/Express**: Backend runtime and web framework.
- **Prisma**: ORM for PostgreSQL interaction.
- **jsonwebtoken**: For JWT-based authentication.
- **bcrypt**: For password hashing.
- **Zod**: For data validation.
- **Tailwind CSS**: For styling the frontend.
- **Radix UI**: For UI components.
- **Motion**: For animations.
- **Lucide React**: For icons.
- **Replit Autoscale**: Deployment platform.