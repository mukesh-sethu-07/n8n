import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Workflow } from './Workflow';

@Entity('workflow_executions')
export class WorkflowExecution {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workflowId!: string;

  @ManyToOne(() => Workflow)
  @JoinColumn({ name: 'workflowId' })
  workflow!: Workflow;

  @Column()
  status!: 'running' | 'success' | 'error';

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ nullable: true })
  finishedAt?: Date;

  @Column('simple-json', { nullable: true })
  data?: Record<string, unknown>;

  @Column('text', { nullable: true })
  error?: string;
}
