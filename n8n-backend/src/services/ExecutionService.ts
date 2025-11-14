import { AppDataSource } from '../database';
import { WorkflowExecution } from '../entities';
import { WorkflowEngine } from '../engine/WorkflowEngine';
import { WorkflowService } from './WorkflowService';
import type { IWorkflow } from '../types';

export class ExecutionService {
  private repository = AppDataSource.getRepository(WorkflowExecution);
  private workflowService = new WorkflowService();
  private engine = new WorkflowEngine();

  async executeWorkflow(workflowId: string): Promise<WorkflowExecution> {
    // Get workflow
    const workflow = await this.workflowService.findById(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Create execution record
    const execution = this.repository.create({
      workflowId,
      status: 'running',
      startedAt: new Date(),
    });
    await this.repository.save(execution);

    try {
      // Execute workflow
      const result = await this.engine.executeWorkflow(workflow as IWorkflow);

      // Update execution with results
      execution.status = result.success ? 'success' : 'error';
      execution.finishedAt = new Date();
      execution.data = result.data;
      execution.error = result.error;

      await this.repository.save(execution);
      return execution;
    } catch (error) {
      // Update execution with error
      execution.status = 'error';
      execution.finishedAt = new Date();
      execution.error = error instanceof Error ? error.message : String(error);

      await this.repository.save(execution);
      return execution;
    }
  }

  async findAll(workflowId?: string): Promise<WorkflowExecution[]> {
    const where = workflowId ? { workflowId } : {};
    return await this.repository.find({
      where,
      order: { startedAt: 'DESC' },
      take: 100, // Limit to last 100 executions
    });
  }

  async findById(id: string): Promise<WorkflowExecution | null> {
    return await this.repository.findOne({ where: { id } });
  }

  getEngine(): WorkflowEngine {
    return this.engine;
  }
}
