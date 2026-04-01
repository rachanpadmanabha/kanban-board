# 📋 Kanban Board

A modern, interactive kanban board application built with React, TypeScript, and Tailwind CSS. Perfect for managing tasks and workflows with a smooth drag-and-drop experience.

## ✨ Features

- **Drag & Drop**: Effortlessly move tasks between columns using dnd-kit
- **Local Storage**: Your tasks persist across browser sessions
- **Create Tasks**: Add new tasks directly from the interface
- **Edit Tasks**: Modify task details inline with a modal interface
- **Delete Tasks**: Remove tasks when they're complete
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Glass-morphism design with smooth animations
- **Type-Safe**: Built with TypeScript for reliability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kanban-board.git
cd kanban-board

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── KanbanBoard.tsx      # Main board component
│   ├── KanbanColumn.tsx      # Column container
│   ├── TaskCard.tsx          # Individual task card
│   ├── TaskModal.tsx         # Task creation/edit modal
│   └── ui/                   # Reusable UI components
│       ├── Badge.tsx
│       ├── GlassButton.tsx
│       ├── GlassCard.tsx
│       ├── GlassInput.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useKanbanBoard.ts    # Board state management
│   └── useLocalStorage.ts   # Local storage hook
├── types/
│   └── index.ts             # TypeScript type definitions
├── data/
│   └── mockData.ts          # Mock/default data
├── App.tsx
├── main.tsx
└── index.css
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4.2
- **Drag & Drop**: dnd-kit 6.3
- **Linting**: ESLint 9
- **Package Manager**: npm

## 🎨 Component Overview

### KanbanBoard
Main component that manages the overall board state and layout.

### KanbanColumn
Represents a column (e.g., To Do, In Progress, Done) with sortable tasks.

### TaskCard
Individual task card with edit and delete capabilities.

### TaskModal
Modal dialog for creating and editing tasks.

### UI Components
- `GlassCard`: Card with glass-morphism effect
- `GlassButton`: Button component matching the design
- `GlassInput`: Input field with glass-morphism style
- `Badge`: Status badge component
- `Modal`: Generic modal wrapper

## 💾 State Management

The app uses React hooks for state management:
- `useKanbanBoard`: Manages board state, tasks, and columns
- `useLocalStorage`: Persists tasks to browser's local storage

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (below 768px)

## 🚀 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

### Setup Instructions

1. **Repository Settings**:
   - Go to your repository Settings → Pages
   - Select "GitHub Actions" as the deployment source

2. **Automatic Deployment**:
   - The workflow automatically deploys on every push to the `main` branch
   - Check the "Actions" tab to see deployment status

3. **Manual Deployment**:
   ```bash
   npm run deploy
   ```

### Repository Configuration

Update the following in `vite.config.ts` if needed:
```ts
base: '/kanban-board/',  // Replace with your repo name if different
```

## 📝 Development

### Running Tests
```bash
npm run lint
```

### Code Style

This project uses ESLint for code quality. Run linting with:
```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for efficient task management**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
