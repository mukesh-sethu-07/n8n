import { Router, Request, Response } from 'express';
import { WorkflowService } from '../services/WorkflowService';

export class WorkflowController {
  public router = Router();
  private service = new WorkflowService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAll.bind(this));
    this.router.get('/:id', this.getById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
    this.router.post('/:id/activate', this.activate.bind(this));
    this.router.post('/:id/deactivate', this.deactivate.bind(this));
  }

  private async getAll(req: Request, res: Response): Promise<void> {
    try {
      const workflows = await this.service.findAll();
      res.json(workflows);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async getById(req: Request, res: Response): Promise<void> {
    try {
      const workflow = await this.service.findById(req.params.id);
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async create(req: Request, res: Response): Promise<void> {
    try {
      const workflow = await this.service.create(req.body);
      res.status(201).json(workflow);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async update(req: Request, res: Response): Promise<void> {
    try {
      const workflow = await this.service.update(req.params.id, req.body);
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async delete(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.service.delete(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async activate(req: Request, res: Response): Promise<void> {
    try {
      const workflow = await this.service.activate(req.params.id);
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const workflow = await this.service.deactivate(req.params.id);
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
