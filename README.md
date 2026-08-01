# 💸 FinTrack - Modern Expense Tracker

A fast, lightweight, and modern expense tracking application built for the **Sheryians Coding School Mini Hackathon**. The main objective of this project was to independently explore and implement **Redux Toolkit** from scratch.

## 🚀 Live Demo & Documentation
- **Live Project:** [https://rishifintrack.dev/](https://rishifintrack.dev/)
- **Complete Redux Master Guide:** [Notion Documentation](https://round-doom-f43.notion.site/Redux_Master_Guide-3acd654721728106a193c33ad4803757?source=copy_link)

## ✨ Key Features & Optimizations
- **Redux Toolkit (v2.12.0) State Management:** Completely powered by RTK (Store, Slices, Actions, Reducers).
- **React 19 Native SEO:** Leverages React 19's native metadata hoisting (no third-party helmet libraries) with JSON-LD structured schema.
- **Zero-Lag Performance (INP Optimized):** Utilizes React 19's `useTransition` and `startTransition` along with RTK `createSelector` memoization to ensure typing and heavy state updates run flawlessly on low-end devices.
- **GPU-Accelerated Animations:** Custom 4-stage staggered delete animations using Tailwind `transform-gpu` for a buttery-smooth experience.
- **Modern UI Architecture:** Clean, DRY (Don't Repeat Yourself) components built with the latest Tailwind CSS v4.3.3.
- **LocalStorage Sync:** Data is never lost on refresh. The Redux store automatically syncs with the browser's local storage.

## 🛠️ Tech Stack (2026 Standards)
- **Frontend:** React 19.2.8 (Vite)
- **State Management:** Redux Toolkit 2.12.0 (`react-redux`, `@reduxjs/toolkit`)
- **Styling:** Tailwind CSS 4.3.3
- **Icons:** Lucide React

## 💡 What I Learned
Through this hackathon and subsequent optimizations, I learned how to avoid "Prop Drilling" by setting up a centralized Redux Store, utilizing `createSelector` for performance, and managing concurrent rendering features like `useTransition` in modern React to ensure maximum UI responsiveness.

---
*Built with ❤️ by Rishikesh Kumar for the Mini Hackathon Challenge.*
