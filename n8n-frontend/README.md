# n8n Frontend

React-based workflow editor for n8n workflow automation platform.

## Features

- ✅ Visual workflow editor with React Flow
- ✅ Drag-and-drop node interface
- ✅ Workflow management (create, edit, save, delete)
- ✅ Real-time workflow execution
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS + Shadcn/ui components
- ✅ Zustand state management

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with proxy to backend)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:3000

## Requirements

- Node.js 18+
- Backend API running on http://localhost:3001

## Tech Stack

- **React** 18 - UI framework
- **TypeScript** 5 - Type safety
- **Vite** - Build tool and dev server
- **React Flow** - Workflow canvas
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Axios** - API client
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── WorkflowCanvas.tsx
│   ├── CustomNode.tsx
│   ├── NodePalette.tsx
│   └── WorkflowList.tsx
├── pages/           # Page components
│   └── WorkflowEditor.tsx
├── stores/          # Zustand stores
│   └── workflowStore.ts
├── api/             # API client
│   └── client.ts
├── types/           # TypeScript types
│   └── index.ts
├── lib/             # Utilities
│   └── utils.ts
├── styles/          # Global styles
│   └── globals.css
└── App.tsx          # Main app component
```

## Development

The frontend uses Vite's proxy to forward API requests to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

Make sure the backend is running before starting the frontend dev server.

## Building

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001/api
```

## Features

### Workflow Editor
- Drag nodes from palette onto canvas
- Connect nodes by dragging from output to input
- Delete nodes by clicking trash icon
- Move nodes by dragging
- Pan and zoom canvas
- Mini-map for navigation

### Workflow Management
- Create new workflows
- Save workflows
- Execute workflows
- Delete workflows
- View workflow list

### Available Nodes
1. Start - Workflow entry point
2. HTTP Request - Make HTTP calls
3. Set - Set data values
4. Code - Execute JavaScript
5. IF - Conditional branching
6. Switch - Multi-way branching
7. Merge - Merge multiple inputs
