# Contributing to LegalEase AI

We welcome contributions! Please follow these standards to maintain our enterprise quality bar.

## 🛠️ Development Workflow

1. **Setup**: Use the `launch.ps1` script to initialize your environment.
2. **Branching**: Use `feature/`, `bugfix/`, or `refactor/` prefixes.
3. **Drafting**: Create a PR once your changes are functional.

## 📏 Coding Standards

### Frontend (React)
- **Aesthetics**: Follow the "Rich Aesthetics" guidelines (glassmorphism, premium colors).
- **Components**: Use the UI components in `src/components/ui`.
- **Typing**: Use JSDoc for complex state.

### Backend (Node.js)
- **Controllers**: Keep logic in controllers, not in route files.
- **Errors**: Always return standard JSON error objects `{ error: "message" }`.
- **Logging**: Log significant state changes (AI attempts, DB connections).

## 🧪 Testing
- **Local Data**: The system falls back to `server/mockData.json` if MongoDB is unavailable. This is perfect for local feature testing.
- All new API endpoints must have a corresponding test in `server/tests`.
- UI changes should be verified across common viewports (Mobile, Tablet, Desktop).

## 🚀 Release Process
Releases are managed via GitHub Actions. Ensure `CHANGELOG.md` is updated before merging to `main`.
