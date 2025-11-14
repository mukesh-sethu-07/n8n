import { AppDataSource } from '../database';
import { Workflow } from '../entities';
import type { IWorkflow } from '../types';

export class WorkflowService {
  private repository = AppDataSource.getRepository(Workflow);

  async create(workflowData: Omit<IWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    const workflow = this.repository.create(workflowData);
    return await this.repository.save(workflow);
  }

  async findAll(): Promise<Workflow[]> {
    return await this.repository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Workflow | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    workflowData: Partial<Omit<IWorkflow, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Workflow | null> {
    const workflow = await this.findById(id);
    if (!workflow) return null;

    Object.assign(workflow, workflowData);
    return await this.repository.save(workflow);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async activate(id: string): Promise<Workflow | null> {
    return await this.update(id, { active: true });
  }

  async deactivate(id: string): Promise<Workflow | null> {
    return await this.update(id, { active: false });
  }
}
