# 🛡️ ClimaShield — Parametric Wage-Loss Protection Prototype

**ClimaShield** is an autonomous, parametric climate risk insurance & wage-loss protection prototype designed for gig delivery workers (Smart India Hackathon 2026 Project).

It continuously monitors micro-climate weather conditions (temperature, humidity, precipitation) via an oracle system and automatically triggers instant UPI payout compensation when weather hazards cross safety thresholds while a rider is on shift.

---

## 🌟 Key Features

### 1. 📱 Rider Mobile App Simulator (Dark Mode)
- **Interactive Phone Frame**: Realistic smartphone UI with dynamic 5G status bar, time display, and battery gauge.
- **Shift Status Toggle**: Switch between `ON SHIFT` (active protection) and `OFF SHIFT` (inactive).
- **Live Telemetry Engine**: Simulated GPS speed (km/h), accelerometer G-force readings, and location tracking.
- **NOAA Wet-Bulb Heat Index Barometer**: Real-time calculated heat index (°C) using NOAA formula and precipitation rate (mm/hr).
- **Instant UPI Payout Modal**: Animated slide-in modal popping up upon parametric hazard trigger, displaying ₹250 instant credit, mock UPI Ref ID (`UPI/2026/CS-XXXXXX`), and confetti celebration.

### 2. 🎛️ Weather Oracle & Underwriter Console
- **Interactive Weather Sliders**:
  - Temperature (25°C to 50°C) with hazard marker at >43°C.
  - Relative Humidity (20% to 95%).
  - Rain Intensity (0 to 60 mm/hr) with hazard marker at >30 mm/hr.
- **Trigger Extreme Disaster Button**: One-click override to simulate severe catastrophic climate events.
- **Delivery Zone Geofence Map**: Interactive Leaflet map displaying delivery hubs (Bangalore) with safe vs hazard geofence tiles and live rider bike position.
- **Underwriter Solvency Ledger**: Real-time capital reserve pool (starts at ₹5,00,000 and updates dynamically), solvency ratio metrics, and an immutable smart-contract audit log table.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI & Animations**: Lucide React, Framer Motion, Canvas Confetti
- **Mapping**: Leaflet + React-Leaflet
- **State Management**: React Context Engine (`ShieldContext.tsx`)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Prathmesh1819/Clima-Shield.git
cd Clima-Shield
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License
