# Local Port Explorer

A professional, full-stack dashboard designed to scan and monitor local ports 3000 through 3020. This tool helps developers quickly identify running services on their local machine and provides direct links to access them.

## 🚀 Features

- **Automated Port Scanning**: Scans a defined range of local ports (3000-3020) using low-level socket checks.
- **Service Title Discovery**: Automatically attempts to fetch the HTML `<title>` of running web services to provide better context.
- **Technical Dashboard UI**: A clean, "mission control" inspired interface built with React and Tailwind CSS.
- **Real-time Updates**: Automatically refreshes port status every 30 seconds.
- **Service Discovery**: Automatically generates launch links for any open ports found.
- **System Logs**: Provides a visual log of scanning activities and results.

## 🛠️ How it Works

### Backend (`server.ts`)
The application uses a custom **Express** server that integrates **Vite** as middleware.
- **Port Scanning Logic**: Uses Node.js's native `net` module to attempt socket connections to `127.0.0.1` on ports 3000-3020.
- **API Endpoint**: Exposes `/api/scan`, which performs the scan asynchronously and returns a JSON array of results.
- **Vite Integration**: During development, it serves the React frontend using Vite's middleware mode for a seamless full-stack experience.

### Frontend (`src/App.tsx`)
A modern **React 19** application styled with **Tailwind CSS**.
- **State Management**: Uses React hooks (`useState`, `useEffect`, `useCallback`) to manage scan results and UI states.
- **Animations**: Leverages `motion` (Framer Motion) for smooth transitions and an interactive feel.
- **Iconography**: Uses `lucide-react` for a consistent, technical aesthetic.

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📝 Scripts

- `npm run dev`: Starts the full-stack development server (Express + Vite).
- `npm run build`: Builds the frontend for production.
- `npm run lint`: Runs TypeScript type checking.
