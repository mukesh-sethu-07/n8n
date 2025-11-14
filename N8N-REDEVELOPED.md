# n8n Re-developed - Separate Frontend & Backend

A complete re-development of n8n workflow automation platform with **separate repositories** for frontend and backend, using **React** instead of Vue.

## 🎯 Overview

This project recreates n8n's core functionality with a modern, separated architecture:

- **Backend**: Node.js + TypeScript + Express + TypeORM
- **Frontend**: React + TypeScript + Vite + React Flow
- **Separate Repos**: Independent development and deployment

## 📦 Projects

### Backend (`/n8n-backend`)
RESTful API and workflow execution engine

**Tech Stack:**
- Node.js 20+, TypeScript 5
- Express 4, TypeORM
- SQLite database
- vm2 for sandboxed code execution

**Features:**
- ✅ Workflow CRUD operations
- ✅ Workflow execution engine
- ✅ 7 built-in nodes
- ✅ REST API

**Port:** 3001

### Frontend (`/n8n-frontend`)
React-based visual workflow editor

**Tech Stack:**
- React 18, TypeScript 5
- Vite, React Flow
- Zustand (state management)
- Tailwind CSS + Shadcn/ui

**Features:**
- ✅ Visual workflow canvas
- ✅ Drag-and-drop nodes
- ✅ Workflow management UI
- ✅ Real-time execution

**Port:** 3000

## 🚀 Quick Start

### Option 1: Run Both Projects

```bash
# Terminal 1 - Backend
cd n8n-backend
npm install
npm run dev

# Terminal 2 - Frontend
cd n8n-frontend
npm install
npm run dev
```

Then open http://localhost:3000

### Option 2: Production Build

```bash
# Build backend
cd n8n-backend
npm install
npm run build
npm start

# Build frontend
cd n8n-frontend
npm install
npm run build
npm run preview
```

## 🧩 Available Nodes

1. **Start** - Workflow entry point
2. **HTTP Request** - Make HTTP requests (GET, POST, PUT, DELETE, PATCH)
3. **Set** - Set or transform data values
4. **Code** - Execute JavaScript code (sandboxed with vm2)
5. **IF** - Conditional branching (true/false outputs)
6. **Switch** - Multi-way routing
7. **Merge** - Combine data from multiple inputs

## 🏗️ Architecture

### Backend Architecture

```
src/
├── entities/        # TypeORM entities (Workflow, Execution, Credentials)
├── services/        # Business logic layer
├── controllers/     # REST API endpoints
├── engine/          # Workflow execution engine
│   ├── WorkflowEngine.ts    # Main execution orchestrator
│   └── NodeRegistry.ts      # Node type registry
├── nodes/           # Node implementations
└── types/           # TypeScript interfaces
```

**Execution Flow:**
1. Client requests workflow execution via API
2. `ExecutionService` retrieves workflow from database
3. `WorkflowEngine` performs topological sort for execution order
4. Nodes execute sequentially, passing data through connections
5. Results saved to database

### Frontend Architecture

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input)
│   ├── WorkflowCanvas.tsx   # React Flow canvas
│   ├── CustomNode.tsx       # Node visualization
│   ├── NodePalette.tsx      # Draggable node list
│   └── WorkflowList.tsx     # Workflow management
├── pages/
│   └── WorkflowEditor.tsx   # Main editor page
├── stores/
│   └── workflowStore.ts     # Zustand state management
├── api/
│   └── client.ts            # Axios API client
└── types/                   # TypeScript types
```

**State Management (Zustand):**
- Current workflow state
- Node types catalog
- Loading/saving states
- CRUD operations for workflows

## 🔌 API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/activate` - Activate
- `POST /api/workflows/:id/deactivate` - Deactivate

### Executions
- `GET /api/executions` - List executions
- `GET /api/executions/:id` - Get execution details
- `POST /api/executions/execute/:workflowId` - Execute workflow

### Node Types
- `GET /api/node-types` - List available node types
- `GET /api/node-types/:name` - Get node type details

## 💡 Key Differences from Original n8n

### Architecture
| Feature | Original n8n | This Version |
|---------|--------------|--------------|
| Monorepo | ✅ Yes (38 packages) | ❌ No (2 separate repos) |
| Frontend | Vue 3 | React 18 |
| State Management | Pinia | Zustand |
| UI Library | Element Plus | Shadcn/ui + Tailwind |
| Styling | SCSS + CSS vars | Tailwind CSS |
| Build Tool | Turbo + pnpm | Vite (separate builds) |

### Scope
| Feature | Original n8n | This Version |
|---------|--------------|--------------|
| Nodes | 400+ | 7 core nodes |
| Authentication | JWT, OAuth, SAML, LDAP | None (MVP) |
| Webhooks | ✅ Yes | ❌ Not yet |
| Queues | Bull/Redis | ❌ Not yet |
| AI Features | ✅ LangChain, MCP | ❌ Not yet |
| Database | PostgreSQL, MySQL, SQLite | SQLite only |
| Deployment | Docker, Cloud | Local only |

## 📈 Future Enhancements

### Backend
- [ ] Add authentication (JWT)
- [ ] Webhook support
- [ ] Job queue (Bull)
- [ ] PostgreSQL/MySQL support
- [ ] More nodes (50+ total)
- [ ] Credential management
- [ ] Workflow versioning
- [ ] Error handling & retry logic

### Frontend
- [ ] Node parameter editor panel
- [ ] Execution history viewer
- [ ] Workflow testing/debugging
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Workflow templates
- [ ] Export/import workflows
- [ ] Multi-user support

## 🛠️ Development

### Backend Development
```bash
cd n8n-backend
npm run dev        # Watch mode with tsx
npm run typecheck  # TypeScript validation
npm run lint       # ESLint
```

### Frontend Development
```bash
cd n8n-frontend
npm run dev        # Vite dev server
npm run build      # Production build
npm run typecheck  # TypeScript validation
```

## 📝 Environment Variables

### Backend (`.env`)
```
PORT=3001
NODE_ENV=development
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd n8n-backend
npm test

# Frontend tests (when implemented)
cd n8n-frontend
npm test
```

## 📄 License

MIT

## 🙏 Credits

Inspired by the original [n8n](https://github.com/n8n-io/n8n) workflow automation platform.

This is a learning/demonstration project showcasing:
- ✅ Separate frontend/backend architecture
- ✅ React vs Vue comparison
- ✅ Modern TypeScript practices
- ✅ Workflow engine implementation
- ✅ Visual programming interface

---

**Note**: This is a minimal viable product (MVP) recreation for educational purposes. For production use, consider the official n8n platform which has extensive features, security, and community support.
