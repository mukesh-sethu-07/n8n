import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { INode, IConnection } from '../types';

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: false })
  active!: boolean;

  @Column('simple-json')
  nodes!: INode[];

  @Column('simple-json')
  connections!: IConnection[];

  @Column('simple-json', { nullable: true })
  settings?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
