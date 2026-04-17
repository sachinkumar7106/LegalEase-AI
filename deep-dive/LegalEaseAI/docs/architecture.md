# Architecture Overview

## System Components

### 1. Frontend (Vite + React)
The frontend is a Single Page Application (SPA) designed for high performance and premium interactivity.
- **State Management**: React Hooks + Local Storage (Auth tokens).
- **Navigation**: Custom state-based routing for fast page transitions.
- **Styling**: Vanilla CSS with Tailwind-inspired utility classes and Framer Motion for animations.

### 2. Backend (Express.js)
The backend is a RESTful API serving the frontend and orchestrating AI workflows.
- **Auth**: JWT-based authentication.
- **File Handling**: Multer middleware for secure PDF processing.
- **Database Logic**: `db.js` provides multi-tenant data storage (using `userId`) with a dynamic switch between MongoDB Atlas and a persistent localized JSON store (`mockData.json`) to ensure the platform remains functional during network or database outages. The system securely isolates chats, cases, and documents by user.

### 3. AI Service (Gemini API)
The core intelligence engine uses Google Gemini.
- **Legal Analysis**: Specialized prompt in `aiService.js` that enforces strict JSON output schema.
- **Chat Logic**: Context-aware conversations that pass document analysis results as hidden system state.

## Data Flow
1. **User Uploads PDF** -> `server/analyze-document`
2. **Backend Parses PDF** -> Sends text to `aiService.js`
3. **Gemini Analyzes** -> Returns structured JSON (Summary, Risks, Clauses)
4. **Frontend Stores Analysis** -> Displays interactive reports
5. **User Hand-off to Chat** -> Analysis context is passed to `ChatPage` for document-grounded Q&A.
