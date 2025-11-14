import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { WorkflowController } from './controllers/WorkflowController';
import { ExecutionController } from './controllers/ExecutionController';
import { NodeTypeController } from './controllers/NodeTypeController';
import { ExecutionService } from './services/ExecutionService';
import {
  HttpRequestNode,
  SetNode,
  CodeNode,
  IfNode,
  SwitchNode,
  StartNode,
  MergeNode,
} from './nodes';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  // Initialize database
  await initializeDatabase();

  // Register nodes
  const executionService = new ExecutionService();
  const nodeRegistry = executionService.getEngine().getNodeRegistry();

  nodeRegistry.registerNode(HttpRequestNode);
  nodeRegistry.registerNode(SetNode);
  nodeRegistry.registerNode(CodeNode);
  nodeRegistry.registerNode(IfNode);
  nodeRegistry.registerNode(SwitchNode);
  nodeRegistry.registerNode(StartNode);
  nodeRegistry.registerNode(MergeNode);

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  const workflowController = new WorkflowController();
  const executionController = new ExecutionController();
  const nodeTypeController = new NodeTypeController();

  app.use('/api/workflows', workflowController.router);
  app.use('/api/executions', executionController.router);
  app.use('/api/node-types', nodeTypeController.router);

  // Start server
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   n8n Backend Server                  ║
║   Running on http://localhost:${PORT}  ║
╚═══════════════════════════════════════╝

Available endpoints:
  GET    /health
  GET    /api/workflows
  POST   /api/workflows
  GET    /api/workflows/:id
  PUT    /api/workflows/:id
  DELETE /api/workflows/:id
  POST   /api/workflows/:id/activate
  POST   /api/workflows/:id/deactivate
  GET    /api/executions
  GET    /api/executions/:id
  POST   /api/executions/execute/:workflowId
  GET    /api/node-types
  GET    /api/node-types/:name

Registered nodes: ${nodeRegistry.getAllNodeTypes().length}
    `);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
