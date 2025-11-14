import { Router, Request, Response } from 'express';
import { ExecutionService } from '../services/ExecutionService';

export class NodeTypeController {
  public router = Router();
  private executionService = new ExecutionService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:name', this.getByName.bind(this));
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    try {
      const engine = this.executionService.getEngine();
      const nodeTypes = engine.getNodeRegistry().getAllNodeTypeMetadata();
      res.json(nodeTypes);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async getByName(req: Request, res: Response): Promise<void> {
    try {
      const engine = this.executionService.getEngine();
      const nodeType = engine.getNodeRegistry().getNodeTypeMetadata(req.params.name);
      if (!nodeType) {
        res.status(404).json({ error: 'Node type not found' });
        return;
      }
      res.json(nodeType);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
