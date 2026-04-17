<div align="center">
  
# ⚖️ LegalEase AI

**Enterprise Legal Intelligence & Contract Analysis Platform**

[![Build Status](https://img.shields.io/badge/build-passing-success?style=for-the-badge)](https://github.com/your-org/legalease-ai)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](#)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

LegalEase AI is a production-grade, AI-powered workspace designed for modern legal teams. It streamlines contract analysis, risk detection, and case management using advanced proprietary prompt engineering built on top of Google Gemini Pro.

[Features](#-key-features) • [Installation](#-installation--deployment) • [Architecture](#-architecture) • [Documentation](#-documentation)

</div>

---

## ✨ Key Features

*   **🧠 Context-Aware AI Assistant**: Engage in deep, context-grounded conversations. The AI automatically ingests analyzed documents, allowing you to ask hyper-specific questions about contracts without re-uploading.
*   **📄 Automated Contract Analysis**: Upload NDAs, MSAs, or any legal PDF. The system instantly extracts summaries, identifies key risk areas, and isolates critical clauses.
*   **💼 Unified Case Management**: Organize documents, track active matters, and manage your legal pipeline from a single, intuitive dashboard.
*   **🔒 Multi-Tenant Data Isolation**: Enterprise-grade security ensures strict data boundaries. Your documents, chat history, and case files are strictly isolated to your authenticated session.
*   **⚡ Premium UI/UX**: Built with React, Vite, and Framer Motion, offering a frictionless, high-performance, and visually stunning user experience featuring glassmorphism and modern design tokens.
*   **🛡️ Resilient Infrastructure**: Features a dynamic database failover system. If the primary cloud database (MongoDB Atlas) is unreachable, the system instantly switches to a persistent local fallback to ensure zero downtime during development.

---

## 🚀 Installation & Deployment

### Prerequisites

Ensure your environment meets the following requirements before proceeding:
*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [MongoDB Atlas](https://www.mongodb.com/atlas) Account (or local MongoDB instance)
*   [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### ⚡ One-Click Local Launch (Windows)

For rapid local development, we provide an automated bootstrapping script.

```powershell
# Run the launch script from the project root
./launch.ps1
```
*This script will automatically install all dependencies, verify your `.env` configuration, and start both the frontend and backend servers concurrently.*

### 🛠️ Manual Configuration

If you prefer manual setup or are deploying to a non-Windows environment:

**1. Clone & Configure Backend**
```bash
cd server
npm install

# Create the environment configuration
cp .env.example .env
```

**Required Environment Variables (`server/.env`):**
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API Server Port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret key for auth tokens | `your-cryptographic-secret` |
| `GEMINI_API_KEY` | Google AI Studio Key | `AIzaSyB...` |

**2. Start the Backend API**
```bash
npm run start
# For development with hot-reload: npm run dev
```

**3. Configure & Start Frontend**
```bash
# In the root directory (LegalEaseAI/)
npm install
npm run dev
```

---

## 🏗️ Architecture

LegalEase AI employs a modern, decoupled client-server architecture designed for horizontal scalability and high availability.

### Context Diagram (Level 0 DFD)

```mermaid
graph LR
    User((Legal<br>Professional))
    System((LegalEase AI<br>Platform))
    Gemini[[Google Gemini<br>Pro API]]
    DB[(Database<br>Storage)]

    User -->|PDF Contracts, Chat Queries| System
    System -->|Risk Summaries, AI Responses| User
    
    System -->|Extracted Text, Prompts| Gemini
    Gemini -->|Structured JSON, Analysis| System
    
    System -->|Save Cases, History| DB
    DB -->|Retrieve User Data| System

    classDef entity fill:#1e293b,stroke:#475569,color:#f8fafc;
    classDef process fill:#0ea5e9,stroke:#0284c7,color:#f0f9ff,shape:circle;
    classDef external fill:#0f172a,stroke:#334155,color:#e2e8f0;
    
    class User entity;
    class System process;
    class Gemini,DB external;
```

### Infrastructure Overview

```mermaid
graph TD
    Client[React Frontend SPA] -->|REST API + JWT| Auth[Express API Gateway]
    Auth --> Controllers[Business Logic Controllers]
    Controllers -->|Mongoose| DB[(MongoDB Atlas)]
    Controllers -.->|Failover| LocalDB[(Local mockData.json)]
    Controllers --> AI[AI Service Wrapper]
    AI -->|Prompt Engineering| Gemini[Google Gemini Pro API]
    
    classDef primary fill:#1a1b26,stroke:#414868,color:#c0caf5;
    classDef secondary fill:#24283b,stroke:#565f89,color:#a9b1d6;
    class Client,Auth,Controllers primary;
    class DB,LocalDB,AI,Gemini secondary;
```

For detailed component interactions, refer to our [Architecture Documentation](docs/architecture.md).

---

## 📁 Project Layout

Following industry standards, the repository strictly separates client, server, and CI/CD concerns.

```text
LegalEase-AI/
├── .github/workflows/   # CI/CD pipelines (GitHub Actions)
├── docs/                # Extended technical specifications
├── server/              # Backend Services (Express.js)
│   ├── config/          # Environment & DB connection logic
│   ├── controllers/     # API route handlers
│   ├── middlewares/     # Authentication & Multer upload handlers
│   ├── models/          # Mongoose schemas (User, Case, Chat, Document)
│   └── routes/          # API route definitions
├── src/                 # Frontend Application (React)
│   ├── components/      # Reusable UI components & layouts
│   ├── pages/           # High-level route views
│   └── lib/             # Utilities and helpers
├── scripts/             # Infrastructure and deployment automation
├── docker-compose.yml   # Container orchestration
└── launch.ps1           # Windows developer bootstrapping
```

---

## 🤝 Contributing

We enforce a strict quality bar for all contributions to maintain our enterprise standards.

1. Review the [Contributing Guidelines](CONTRIBUTING.md) for coding standards.
2. Check the [Changelog](CHANGELOG.md) to understand recent architectural shifts.
3. Ensure all code is formatted according to the `.editorconfig`.
4. Submit pull requests against the `develop` branch.

---

<div align="center">
  <br/>
  <p><b>LegalEase AI</b> is a proprietary platform.</p>
  <p>&copy; 2026 LegalEase AI Inc. All rights reserved.</p>
</div>
