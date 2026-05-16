# 🌍 Global Transfer UI (XOF ↔ EUR/USD)

A premium, interactive, and highly cinematic decentralized application (dApp) interface built for seamless cross-border stablecoin transfers. This project represents the frontend architecture for exchanging CFA Francs (XOF) with global reserve currencies (EUR, USD) through blockchain technology.

Designed and developed by **CAPSI Boyz**.

---

## ✨ Features

- **Immersive 3D Visuals:** A highly optimized React Three Fiber integration featuring a wireframe HoloGlobe with dynamic orbital data packets that visually represents global financial routing.
- **Cinematic UX/UI:** Butter-smooth page transitions (Framer Motion), scroll-linked stagger animations (Lenis & GSAP), and ultra-premium Glassmorphism aesthetics.
- **Bidirectional Swaps:** A fully dynamic Transfer Dashboard that allows real-time swapping between source and target currencies (XOF ↔ USD/EUR).
- **Dual-Theme Engine:** Complete integration of both an immersive `Dark Abyss` theme and an ultra-crisp `Light White` theme with zero performance overhead.
- **Wallet-Ready Architecture:** Includes a mocked Web3 connection state (Zustand) ready to be plugged into Ethers.js or Wagmi for live testnet operations on Sepolia.

---

## 🛠️ Technology Stack

- **Framework:** React 18 (TypeScript) + Vite
- **Styling:** TailwindCSS + Custom CSS Modules (Vanilla for high-performance animations)
- **3D Engine:** Three.js + React Three Fiber + Drei
- **Motion & Animation:** Framer Motion + GSAP + Lenis Scroll
- **State Management:** Zustand
- **Icons:** Lucide React

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your machine.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Cheikhsmb/GlobalTransferUI.git
cd GlobalTransferUI
npm install
```

### 3. Development Server
Run the local Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```

---

## 🏛️ Project Architecture

```text
src/
├── components/          # Reusable UI components (Buttons, Cards, Panels)
│   ├── HeroScene.tsx    # 3D R3F Global Network Scene
│   ├── TransferPanel.tsx# Core Stablecoin Swap Logic
│   └── SiteFooter.tsx   # Global Footer
├── hooks/               # Custom React hooks (useLenis, useMediaQuery)
├── pages/               # Application Routes (Home, Experience)
├── store/               # Zustand Global State (useAppStore.ts)
├── index.css            # Global Theme Tokens & Overrides (Dark/Light)
└── App.tsx              # Main Application Shell & Routing
```

---

## 🔒 Smart Contract Integration (Next Steps)
This UI is currently acting as a high-fidelity conceptual demonstrator. The architecture (`src/store/useAppStore.ts`) has been structured specifically to accept blockchain RPC calls. 
Future implementations will connect the `TransferPanel` to deployed Solidity smart contracts on the **Ethereum Sepolia Testnet**.

---

<p align="center">
  <i>Projet Blockchain par CAPSI Boyz — Interface conceptuelle.</i>
</p>
