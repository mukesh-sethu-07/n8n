import { Router, Request, Response } from 'express';
import { ExecutionService } from '../services/ExecutionService';

export class ExecutionController {
  public router = Router();
  private service = new ExecutionService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/execute/:workflowId', this.execute.bind(this));
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    try {
      const workflowId = req.query.workflowId as string | undefined;
      const executions = await this.service.findAll(workflowId);
      res.json(executions);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async getById(req: Request, res: Response): Promise<void> {
    try {
      const execution = await this.service.findById(req.params.id);
      if (!execution) {
        res.status(404).json({ error: 'Execution not found' });
        return;
      }
      res.json(execution);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async execute(req: Request, res: Response): Promise<void> {
    try {
      const execution = await this.service.executeWorkflow(req.params.workflowId);
      res.json(execution);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
