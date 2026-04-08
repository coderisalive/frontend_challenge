# 📅 Premium Interactive 3D Wall Calendar

A high-fidelity, interactive React application that replicates the "physical" experience of a premium wall-hanging calendar. Designed with a focus on tactile aesthetics, smooth 3D transitions, and intelligent productivity features.

[**🚀 View Live Demo**](https://frontend-challenge-seven-ruddy.vercel.app/)

## 🌟 Key Features

### 🔄 Cinematic 3D Engine
- **360° Page Flipping**: Navigate months and years with a seamless, continuous 3D rotation. The mounting wire and board perform a full physical flip while the nail remains "pinned" to the wall.
- **Integrated Hardware**: Features a realistic metallic mounting hole, a polished static nail, and a hanging wire that correctly layers behind the board for a grounded physical feel.
- **Tactile Binder**: The silver spiral binder is physically anchored to the board, spinning in perfect synchronization during the flip animation.

### 📝 Intelligent Productivity Suite
- **Click-to-Note Interaction**: Click any date or range on the calendar to automatically insert a formatted template (`2 April -> `) at the **top** of your notes area.
- **Dynamic Colorful Highlighting**: Dates in the calendar grid automatically receive a **pulsing blue indicator** only when you've typed an entry for that day.
- **Global Todo List**: Fast, animated task management with completion toggles and removal.
- **Automatic Persistence**: All notes, tasks, and theme settings are saved to **Local Storage**, ensuring your data is ready whenever you return.

### 🌓 Professional Dark Mode & Themes
- **Universal Transformation**: A reliable theme toggle (via React Portals) that transforms the wall background and calendar skin simultaneously.
- **Optimized Legibility**: High-contrast typography and subtle inner-shadows ensure perfect reading in both light and dark environments.

### 📱 Smart Responsiveness
- **Adaptive Layouts**: Specifically optimized for viewports smaller than **800px x 590px**.
- **Mobile Comfort**: Automatically reduces hero height and adjusts typography on small screens to ensure the calendar grid remains accessible without excessive scrolling.

## 🚀 Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3.4 (with Custom Configuration)
- **Animation**: CSS 3D Transforms (`perspective`, `rotateY`)
- **Persistence**: Web Storage API (LocalStorage)

## 🛠️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📖 Usage Guide

- **Switching Themes**: Click the sun/moon icon in the top-right corner.
- **Adding Notes**: Click any date on the grid. A new line will appear at the top of the "NOTES" section. Type your entry after the `->` to highlight that date.
- **Selecting Ranges**: Click a start date, then an end date. The entire range will be highlighted and added to your notes.
- **Managing Tasks**: Type in the "Add a task" field and hit `Enter`. 

---
