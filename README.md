# Premium Interactive Wall Calendar

A high-fidelity, interactive React application that replicates the "physical" experience of a premium wall-hanging calendar. Designed with a focus on tactile aesthetics, smooth transitions, and productivity features.

[**🚀 View Live Demo**](https://frontend-challenge-seven-ruddy.vercel.app/)

## 🌟 Key Features

### 📅 Advanced Calendar Engine
- **Dynamic Navigation**: Browse any month or year using minimalist navigation controls embedded in the hero section.
- **Date Range Selection**: Select start and end dates with a fluid, connected highlight system.
- **Today Awareness**: Automatically synchronizes with the real-time date, marked by a subtle grey "Today" indicator.
- **Perfect Grid Logic**: Handles every month length, leap year, and weekday alignment (Monday start) with grayed-out padding days for a consistent aesthetic.

### 📝 Productivity Suite
- **Interactive Todo List**: Quick-add tasks with entrance animations, completion toggles, and deletion.
- **Ruled Notes Section**: A functional textarea for deep thoughts, complete with 4 professional ruled lines that adapt to your text.
- **File Attachments**: Seamlessly attach and manage files in your daily notes with a built-in file upload interface.

### 🖼️ Cinematic Aesthetics
- **Wall-Hanging Context**: Features a realistic metallic mounting hole, a polished nail, and a thick hanging rope for a grounded physical feel.
- **Grayscale Hover Reveal**: The hero image starts in an elegant black-and-white state, smoothly transitioning to full color as you interact with the calendar.
- **3D Depth**: Utilizes subtle rotations, custom multi-layered shadows, and the `perspective` property to simulate a manually hung object on a textured plaster wall.
- **3D Page Flipping**: Navigate months with seamless, continuous 180-degree 3D page flips. The custom silver spiral binder remains immutably anchored in the foreground to simulate a tactile physical calendar.

### 🌓 Professional Dark Mode
- **Universal Transformation**: A master toggle (top-right) that transforms both the wall background and the calendar skin simultaneously.
- **Silhouette Mode**: In Dark Mode, the wire becomes a sharp black silhouette against a deep charcoal wall, highlighted by a brilliant white metallic nail.
- **Optimized Legibility**: Dark theme uses high-contrast gray-200 text and defined borders for perfect reading in low-light environments.

## 🚀 Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3.4 (with Custom Configuration)
- **Icons/Graphics**: Custom SVG & Radial Gradients
- **Typography**: Inter (Modern Sans-Serif)

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

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📖 Usage Guide

- **Switching Themes**: Use the icon at the top-right corner to alternate between Light and Dark mode.
- **Navigating Months**: Hover over the Month or Year in the blue hero section to reveal the `<` and `>` navigation arrows.
- **Selecting Dates**: Click once for a start date, and click again on a later date to define a range. Click any date again to reset.
- **Managing Tasks**: Type your task in the "Add a task" field and hit `Enter`. Click the checkbox to toggle or the `x` to delete.

---

