# n8n Backend

Workflow automation engine backend built with Node.js, TypeScript, and Express.

## Features

- ✅ RESTful API for workflow management
- ✅ Workflow execution engine
- ✅ 7 built-in nodes (HTTP Request, Set, Code, IF, Switch, Start, Merge)
- ✅ SQLite database (TypeORM)
- ✅ TypeScript with strict mode

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get workflow by ID
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/activate` - Activate workflow
- `POST /api/workflows/:id/deactivate` - Deactivate workflow

### Executions
- `GET /api/executions` - List executions
- `GET /api/executions/:id` - Get execution by ID
- `POST /api/executions/execute/:workflowId` - Execute workflow

### Node Types
- `GET /api/node-types` - List all available node types
- `GET /api/node-types/:name` - Get node type details

## Available Nodes

1. **Start** - Entry point for workflows
2. **HTTP Request** - Make HTTP requests
3. **Set** - Set data values
4. **Code** - Execute JavaScript code
5. **IF** - Conditional branching
6. **Switch** - Multi-way branching
7. **Merge** - Merge data from multiple inputs

## Tech Stack

- Node.js 20+
- TypeScript 5
- Express 4
- TypeORM
- SQLite
- vm2 (sandboxed code execution)

## Development

```bash
# Run type checking
npm run typecheck

# Run linter
npm run lint
```

## Environment Variables

Create a `.env` file:

```
PORT=3001
NODE_ENV=development
```
