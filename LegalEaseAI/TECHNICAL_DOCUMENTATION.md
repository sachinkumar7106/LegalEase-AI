# LegalEase AI - Technical Documentation

> [!NOTE]
> This project is also referred to as **LegalEye**. For consistency, this document uses **LegalEase AI**.

---

# 1. PROJECT OVERVIEW

LegalEase AI is a sophisticated MERN (MongoDB, Express, React, Node.js) application designed to empower legal professionals with AI-driven document analysis and case management tools. By leveraging state-of-the-art Large Language Models (LLMs), it automates the extraction and analysis of critical clauses, risks, and summaries from complex legal documents.

## High-Level Architecture
```text
+-----------------------+      +-------------------------+      +-----------------------+
|       FRONTEND        |      |        BACKEND          |      |      EXTERNAL         |
|   (React 19, Vite)    | <--> |   (Express, Node.js)    | <--> |   (Google Gemini AI)  |
+-----------+-----------+      +------------+------------+      +-----------------------+
            |                               |
            |                    +----------v----------+
            |                    |      DATABASE       |
            +------------------> |      (MongoDB)      |
                                 +---------------------+
```

## Technology Stack
| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 19.x | Component-based UI library |
| | Vite | 8.x | Next-generation frontend tooling |
| | Tailwind CSS | 4.x | Utility-first styling framework |
| | Framer Motion| 12.x | Physics-based animations |
| **Backend** | Node.js | Latest | Runtime environment |
| | Express | 5.x | Web application framework |
| | Multer | 2.x | Middleware for handling file uploads |
| | pdf-parse-new| 2.x | PDF text extraction library |
| **Database**| MongoDB | 7.x | NoSQL document database |
| | Mongoose | 9.x | MongoDB object modeling |
| **AI** | Google Gemini| 2.5-flash | AI analysis and chat assistant |

## Core Features
- **AI Document Analysis**: Automated PDF parsing and risk assessment.
- **AI Assistant**: Context-aware legal chat (Assistant).
- **Case Management**: Organize documents and notes by legal case.
- **Secure Auth**: JWT-based authentication with password hashing.
- **Modern UI**: Dark/Light mode support with premium glassmorphism aesthetics.

## Target Audience
- **Legal Professionals**: For quick document vetting and risk identification.
- **Internal Compliance Teams**: To streamline contract reviews.
- **Individuals**: To understand complex legal jargon in agreements.

---

# 2. SYSTEM ARCHITECTURE

## 2.1 Frontend Architecture
The frontend is built as a Single Page Application (SPA) using React 19. It follows a modular structure focused on separation of concerns.

- **Component Hierarchy**:
    - `App.jsx`: Root component handling routing and global layout.
    - `AuthenticatedApp`: Wrapper for private routes with Sidebar/Header.
    - `Pages/`: Distinct views (Dashboard, Upload, Chat, etc.).
    - `Components/ui/`: Reusable, atomic UI elements (Buttons, Inputs).
- **State Management**:
    - **Context API**: Used for Global Authentication state (`AuthContext`).
    - **Local State**: `useState` and `useReducer` for component-specific logic (e.g., chat messages, upload progress).
- **Routing**: Client-side routing managed by `react-router-dom` with lazy loading for optimized performance.
- **Data Flow**: Unidirectional data flow from parents to children via props, and upward via callbacks/events.

## 2.2 Backend Architecture
The backend is a RESTful API built with Express 5, utilizing ES Modules.

- **Server Structure**: Organized into `routes`, `controllers`, `models`, and `middlewares`.
- **API Layer**: Defined in `routes/`, mapping endpoints to controller functions.
- **Middleware Pipeline**:
    - `cors`: Handles cross-origin requests.
    - `express.json`: Parses incoming JSON payloads.
    - `requireAuth`: Proprietary middleware for verifying JWT tokens.
    - `upload`: Multer middleware for buffering file uploads.
- **Service Layer**: AI logic is abstracted into `aiService.js`, decoupled from the HTTP layer.

## 2.3 Database Schema (MongoDB/Mongoose)

### Users Collection
Stores user credentials and profile information.
- `name`: String (Required, trimmed)
- `email`: String (Required, unique, indexed, lowercase)
- `passwordHash`: String (Required, hashed via bcrypt)
- `timestamps`: Automatically managed `createdAt`/`updatedAt`.

### Documents Collection
Stores processed documents and their AI analysis results.
- `title`: String (Filename)
- `originalText`: String (Extracted PDF content)
- `document_overview`: String (AI-generated summary)
- `important_clauses`: Array of Objects (`{ text: string, explanation: string }`)
- `risk_summary`: Array of Objects (`{ level: string, text: string }`)
- `suggestions`: Array of Strings
- `createdAt`: Date (Defaults to `Date.now`)

### Relationships
- Documents are currently loosely coupled but the UI filters views based on active user sessions.
- Cases (separate collection) can reference multiple documents and chats.

### Indexing Strategy
- Primary index on `email` in `Users` for O(1) login lookups.
- Potential index on `title` in `Documents` for faster search as the library grows.

---

# 3. AUTHENTICATION FLOW

LegalEase AI implements a standard JWT (JSON Web Token) authentication flow to secure user data and API endpoints.

## Step-by-Step Breakdown

1.  **Registration**:
    - Frontend sends `name`, `email`, and `password` to `/auth/signup`.
    - Backend normalizes email and hashes password using `bcrypt` (via `utils/auth.js`).
    - User document is saved in MongoDB.
    - A JWT token is signed and returned to the client.
2.  **Login**:
    - Frontend sends credentials to `/auth/login`.
    - Backend validates credentials against stored hashes.
    - If valid, a new JWT token is issued.
3.  **Token Validation**:
    - Tokens are typically sent in the `Authorization` header as a Bearer token or stored in `localStorage` by the client.
    - Backend middleware `requireAuth` intercepts protected requests to verify the token signature.
4.  **Protected Route Handling**:
    - The `AuthenticatedApp` component in React checks the `isLoggedIn` state from `AuthContext`.
    - If not logged in, users are redirected to the Login/Landing page.
5.  **Session Management**:
    - The `AuthContext` provides a `logout()` function that clears the local token and resets the application state.

## Authentication Sequence Diagram
```text
User            Frontend            Backend            Database
 |----Signup----->|                   |                   |
 |                |-----Payload------>|                   |
 |                |                   |----Hash/Save----->|
 |                |                   |<----Success-------|
 |                |<----JWT/User------|                   |
 |---LoggedIn---->|                   |                   |
```

## Key Security Measures
- **bcrypt Hashing**: Passwords are never stored in plain text.
- **JWT Signing**: Tokens are signed with a server-side secret key.
- **Input Validation**: Backend verifies email formats and password lengths before processing.

---

# 4. DOCUMENT UPLOAD WORKFLOW

The upload workflow transforms raw PDF files into actionable legal insights through a multi-stage pipeline.

## Detailed Flow

1.  **Frontend: File Selection**: Uses the `UploadPage` with a custom file drop zone. Only `.pdf` files are accepted (client-side validation).
2.  **Frontend: Submission**: Files are sent via `FormData` to the `/analyze-document` endpoint. Progress is tracked using standard `XHR` or `fetch` state.
3.  **Backend: Multer Middleware**: The file is stored in memory (`multer.memoryStorage()`) to avoid disk latency and for better security.
4.  **Backend: PDF Extraction**: `pdf-parse-new` extracts the raw text from the buffer. It handles normalization and basic whitespace cleanup.
5.  **Backend: DB Record Creation**: A new `Document` record is created containing the extracted text and metadata.
6.  **Response Handling**: The processed document ID is returned to the frontend for immediate navigation to the viewer.

### Error Handling
- **Invalid Format**: Backend checks mimetype to ensure only PDFs are processed.
- **Size Limits**: Prevent DOS attacks by limiting file size in Multer config.
- **Extraction Failures**: Graceful fallback if a PDF is scanned (image-based) and text cannot be extracted.

---

# 5. AI ANALYSIS PIPELINE

The AI pipeline is the "brain" of the application, converting raw text into structured JSON data.

## Implementation Details

1.  **Trigger**: User clicks "Analyze" or it happens automatically upon upload completion.
2.  **Prompt Construction**: 
    - A system-level prompt instructs the AI to behave as a "Legal AI Assistant".
    - It enforces a strict JSON output schema to ensure compatibility with the UI.
3.  **AI Call (Google Gemini)**:
    - Uses `gemini-2.5-flash` for high speed and accuracy.
    - Implements **Retry Logic** (up to 3 attempts) with exponential backoff if the API is busy or ratelimited.
4.  **Response Parsing**:
    - `JSON.parse` is used to convert the AI string output into a JavaScript object.
    - Validation ensures all mandatory keys (`document_overview`, `risk_summary`, etc.) are present.
5.  **Mock Data Fallback**: 
    - If the AI engine fails after retries, the system falls back to a "Service Unavailable" message structure to prevent application crashes.
6.  **Storage**: The result is saved back to the `Document` model in MongoDB.

## JSON Response Structure (Example)
```json
{
  "document_overview": "Summary of the agreement...",
  "clause_tags": ["Termination", "Liability"],
  "important_clauses": [
    { "text": "Clause 1.2...", "explanation": "This means..." }
  ],
  "risk_summary": [
    { "level": "High", "text": "Infinite liability clause found." }
  ],
  "suggestions": ["Add a cap to liability."]
}
```

---

# 6. API ENDPOINTS REFERENCE

## Authentication Endpoints (`/auth/*`)
All auth endpoints return a success/error message and, where applicable, the user object and JWT.

| Method | Path | Body | Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/auth/signup` | `{name, email, password}` | No | Register a new user |
| POST | `/auth/login` | `{email, password}` | No | Authenticate and get JWT |
| GET  | `/auth/me` | None | Yes | Get currently logged-in user profile |

## Document & Analysis Endpoints
Endpoints for uploading and processing legal documents.

| Method | Path | Params/Body | Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/analyze-document` | Form-data: `document` (PDF) | Yes | Upload, parse, and analyze PDF |
| POST | `/analyze` | `{text}` | Yes | Analyze raw legal text directly |
| POST | `/chat` | `{messages: [{role, text}]}` | Yes | Interaction with Legal AI Assistant |

## Case & History Endpoints (`/cases/*`, `/chat-history/*`)

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/cases` | Yes | Retrieve all cases for the user |
| POST | `/cases` | Yes | Create a new legal case folder |
| GET | `/chat-history` | Yes | Retrieve past AI assistant conversations |

## Example cURL Command (Login)
```bash
curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
```

---

# 7. FRONTEND COMPONENT BREAKDOWN

## 7.1 Major Pages

### Layout (Global)
- **File**: `App.jsx` (specifically `AuthenticatedApp`)
- **Responsibility**: Provides the persistent Sidebar, Topbar, and navigation container.
- **Key Features**: Collapsible sidebar, user profile dropdown, and breadcrumb-style page titles.

### PublicLandingPage
- **File**: `pages/PublicLandingPage.jsx`
- **Purpose**: High-converting introductory page for unauthenticated users. 
- **Features**: Hero section, feature bento grid, and calls to action (CTA).

### DashboardPage
- **File**: `pages/DashboardPage.jsx`
- **Purpose**: Central hub for authenticated users.
- **Components**: Quick statistics (Documents processed, Active cases), Recent activity list.
- **API Calls**: Fetches aggregated document and case data.

### UploadPage
- **File**: `pages/UploadPage.jsx`
- **Purpose**: Primary interface for ingest.
- **State Management**: Handles file selection state, upload status, and display of AI analysis results.
- **Logic**: Uses a multi-step UI flow: Upload -> Processing -> Results View.

### ChatPage (AI Assistant)
- **File**: `pages/ChatPage.jsx`
- **Purpose**: Real-time legal consultation interface.
- **Features**: Message history window, auto-scrolling, and suggested prompts.

## 7.2 Reusable UI Components
Located in `src/components/ui/`, built on top of Radix UI and Tailwind CSS.
- **Button**: Highly configurable with variants (`primary`, `outline`, `ghost`).
- **Card**: Glassmorphic container with custom hover states.
- **Toaster**: Global notification system (powered by `sonner`).

---

# 8. STATE MANAGEMENT

## 8.1 AuthContext
The core of the application's state is the `AuthContext`, which manages the user's authentication journey.

- **Initialization**: Upon application load, the context checks `localStorage` for a stored JWT.
- **Verification**: If a token exists, it calls the `/auth/me` endpoint to hydrate the `user` state.
- **Provider Value**:
  - `user`: Currently authenticated user object.
  - `isLoggedIn`: Boolean flag for UI branching.
  - `login(token, userData)`: Function to persist session.
  - `logout()`: Function to clear session and redirect.

## 8.2 Token Strategy
- **Storage**: Tokens are stored in `localStorage` under the key `legalease_token`.
- **Transmission**: The `useAuth` hook (or a global fetch wrapper) attaches the token to the `Authorization` header for all backend requests.

---

# 9. ERROR HANDLING STRATEGY

## 9.1 Frontend Patterns
- **User Alerts**: Success and Error messages are displayed using the `sonner` toast notification system.
- **Validation Errors**: Form inputs (Login/Signup) validate data before submission, preventing unnecessary API calls.
- **Async Handling**: `try...catch` blocks wrap all API calls to catch network timeouts or server errors.

## 9.2 Backend Middleware
- **Global Error Handler**: A central middleware in `server/index.js` catches all `next(err)` calls.
- **Structure**: Errors are returned as a JSON object: `{ "error": "Human readable message" }`.
- **Status Codes**: Uses semantic HTTP codes (401 for Auth, 400 for Bad Requests, 503 for AI failures).

---

# 10. SECURITY MEASURES

- **Password Hashing**: Utilizes `bcrypt` with a salt factor of 10 to protect user credentials.
- **JWT Protection**: Tokens are signed with a unique `JWT_SECRET` defined in environment variables.
- **Environment Management**: Sensitive keys (DB URI, AI API Key, JWT Secret) are strictly managed via `.env` files and never committed to version control.
- **File Upload Security**:
  - **Memory Buffering**: Files are processed in RAM, ensuring no temporary files are left on the server.
  - **Type Whitelisting**: Multer is restricted to `.pdf` mimetypes only.
- **CORS Configuration**: Restricts API access to authorized frontend origins.

---

# 11. DATA FLOW DIAGRAMS

## 11.1 Complete User Registration Flow
```text
[UI] Register Form --(Submit)--> [Controller] Validate & Hash --(Save)--> [DB] User Document
        ^                                                                     |
        |                                                                     |
[Browser] Save JWT <-------------[Response] 201 Created + Token <-------------+
```

## 11.2 Document Upload and Analysis Flow
```text
[UI] Drop PDF --(Multipart)--> [Multer] Buffer --(pdf-parse)--> [Service] Raw Text
                                                                     |
[UI] Display Result <--- [Response] JSON <--- [Gemini] AI Analysis <--+
```

## 11.3 Authentication Flow
```text
[Client] Request + JWT Header --(Middleware)--> [Express] Verify Token
                                                       |
[Controller] Success Action <--- [Verified User] <-----+
```

---

# 12. CODE ORGANIZATION

The project follows a standard MERN separation of concerns, optimized for developer productivity.

## Folder Structure
- `/` (Root): Frontend source and configuration.
  - `/src`: React components, hooks, and contexts.
  - `/public`: Static assets.
- `/server`: Node/Express backend logic.
  - `/controllers`: HTTP request handlers.
  - `/models`: Database schemas.
  - `/routes`: Endpoint definitions.
  - `/middlewares`: Request pre-processing logic.
  - `/utils`: Common utility functions (Auth, DB).

## Naming Conventions
- **Frontend**: PascalCase for components (`UploadPage.jsx`), camelCase for hooks (`useAuth.js`).
- **Backend**: camelCase for files and functions (`authController.js`, `signup`).
- **CSS**: Tailwind utility classes; custom styles in `index.css`.

---

# 13. CONFIGURATION FILES

## 13.1 Package Files
- **Root `package.json`**: Manages frontend dependencies and the `concurrently` start script.
- **Server `package.json`**: Manages backend-specific dependencies (`mongoose`, `gemini`).

## 13.2 Environment Variables (`.env`)
Required variables for the application to function:
- `PORT`: Server port (default 5000).
- `MONGODB_URI`: Connection string for MongoDB.
- `JWT_SECRET`: Secret key for token signing.
- `GEMINI_API_KEY`: API key for Google Gemini access.

## 13.3 Build Tools
- **vite.config.js**: Configures the dev server and build pipeline.
- **tailwind.config.js**: Customizes theme colors (Primary gold/legal blue) and spacing.

---

# 14. DEPLOYMENT GUIDE

## 14.1 Production Build
1. Run `npm run build` in the root directory.
2. This generates a `dist/` folder containing optimized HTML/JS/CSS.

## 14.2 Deployment Platforms
- **Frontend**: Deploy `dist/` to **Vercel** or **Netlify**. Ensure the API proxy or base URL reflects the backend production endpoint.
- **Backend**: Deploy the `/server` folder to **Render**, **Railway**, or **AWS/DigitalOcean**.
- **Database**: Use **MongoDB Atlas** for a managed cloud database.

---

# 15. TESTING STRATEGY

## 15.1 Manual Testing Checklist
- [ ] Sign up with a new email.
- [ ] Log in and verify session persistence on refresh.
- [ ] Upload a standard text-based PDF.
- [ ] Verify AI analysis matches the document content.
- [ ] Verify Chat Assistant maintains context.
- [ ] Log out and ensure protected routes are inaccessible.

## 15.2 Edge Cases
- Empty or corrupted PDFs.
- Extremely large documents (handling truncation).
- Offline API scenarios (checking graceful fallbacks).

---

# 16. EXTENSION POINTS

How to add new features to LegalEase AI:
- **New Analysis Type**: Modify `LEGAL_ANALYSIS_PROMPT` in `server/aiService.js` and update the JSON structure in the `Document` model.
- **Additional Doc Types**: Update Multer config in `middlewares/upload.js` to allow `.docx` or `.txt`.
- **User Roles**: Add a `role` field to the `User` model and check in `requireAuth`.

---

# 17. TROUBLESHOOTING GUIDE

- **MongoDB Connection**: Ensure your IP is whitelisted in MongoDB Atlas.
- **CORS Errors**: Check `cors()` configuration in `server/index.js` for the correct frontend URL.
- **AI Failures**: Ensure `GEMINI_API_KEY` is valid and hasn't hit quota limits.

---

# 18. PERFORMANCE OPTIMIZATION

- **Current**: Standard lazy loading for routes and memory buffering for uploads.
- **Goal**: Implement Redis caching for common document analyses and compression for AI responses.

---

# 19. FUTURE ENHANCEMENTS ROADMAP

- [ ] **PDF Analysis Export**: Download analysis as a formatted PDF.
- [ ] **OCR Engine**: Support for scanned image documents.
- [ ] **Case Collaboration**: Share cases with other legal team members.
- [ ] **Statute Lookup**: Integration with official legal database APIs.

---

# 20. DEVELOPMENT WORKFLOW

- **Git Strategy**: Use `main` for stable releases and feature branches for new tools.
- **Linting**: Pre-configured with ESLint for consistent code quality.
- **Startup**: `npm start` runs both client and server simultaneously.

---
