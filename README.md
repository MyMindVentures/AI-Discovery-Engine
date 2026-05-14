# AI Discovery Engine — Production SaaS Blueprint v1.1

AI-native SaaS platform that transforms fragmented internet research into structured, reusable, and actionable business intelligence datasets.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-v19-blue.svg?logo=react)
![Tailwind](https://img.shields.io/badge/tailwind-v4-38bdf8.svg?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/prisma-v6-2d3748.svg?logo=prisma)

## 🚀 Overview

The AI Discovery Engine is designed for founders, sales teams, and investors who waste hours navigating disconnected tools like Google, LinkedIn, and spreadsheets. It transforms internet chaos into structured operational intelligence through natural language orchestration.

### 🌊 Core Workflows
- **AI Prompt Search**: Natural language company discovery using semantic awareness (e.g., "Find 200 AI app studios in Europe").
- **Search Orchestration**: Distributed scraping and crawling using Apify, Firecrawl, and Playwright.
- **Deep Enrichment**: Automated metadata extraction via People Data Labs, Apollo, and Crunchbase.
- **AI Tagging & Scoring**: Automatic categorization and ranking based on custom research logic.
- **Semantic Mapping**: Embedding-based similarity search using `pgvector`.
- **Persistent Monitoring**: Recurring extraction nodes tracking market movements and competitor pivots.

## ✨ Key Features

- **Intelligence Console**: A modern AI-native UI optimized for high-density data monitoring.
- **Faceted Protocol**: Multi-layer filtering system for precision drill-down into discovered datasets.
- **Neural Alerts**: Real-time notifications for monitoring triggers and exfiltration completion.
- **Enterprise Settings**: Global management of Profile, Workspace, Language (10+ languages), and Visual Spectrum (Dark/Light).
- **Admin Command Center**: Complete oversight of scraping queues, AI costs, and system telemetry.
- **Developer Node**: Robust API key management and integration bridges (Notion, Slack, HubSpot).

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion (motion/react)
- **Backend**: Node.js, Express (Custom ESM + CJS Bundle), BullMQ + Redis
- **Database**: PostgreSQL with `pgvector`, Prisma ORM
- **AI**: Gemini AI (@google/genai)
- **Design**: AI-first Interaction Model - Search as the primary UX element across all devices.

## 🏗 User Roles & Permissions

- **Guest**: Demo search, view landing page.
- **Free/Pro User**: AI search, saved lists, monitoring jobs, and limited/unlimited exports.
- **Team/Admin**: Shared workspaces, team monitoring, billing management, and API key governance.
- **Platform Admin**: Full database access, scraping management, and source telemetry.

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- Redis (for scraping queues)
- Gemini API Key

### Quick Start
1. `npm install`
2. `cp .env.example .env` (Add your API keys)
3. `npx prisma db push`
4. `npm run dev`

## 🏗 Architecture
The system is built on a **modular service-oriented architecture**:
- `src/pages`: Feature-complete views for high-performance discovery.
- `src/services`: Schema-first service layer with implementation-ready logic.
- `src/hooks`: Persistent state management for user preferences and clusters.
- `server.ts`: Express entry point for API routes and worker orchestration.

## 📄 License
MIT License. See [COPYRIGHT.md](COPYRIGHT.md) for details.
