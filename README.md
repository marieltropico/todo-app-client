# Todo App with React Native & Expo

A full-stack todo application built with React Native, Expo, and TypeScript, featuring user authentication and real-time todo management.

## Features

- 🔐 User Authentication (Login/Register)
- ✅ Create, Read, Update, Delete Todos
- 🔄 Real-time Updates
- 💾 Persistent Storage
- 📱 Cross-platform (iOS, Android, Web)
- 🔒 Secure API Integration
- ✨ Clean and Intuitive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

## Environment Variables
Note: For ease of review, the .env file has been included in the repository. In a production environment, you should:

- Remove .env from version control
- Add it to .gitignore
- Create a .env.example file with:
```
EXPO_PUBLIC_API_URL=http://localhost:5001/api
```

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Start the app
```bash
npx expo start
```

3. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## Testing

To run tests:
```bash
npm run test:coverage
```
