/**
 * Todo status enum
 */
export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Todo priority enum
 */
export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

/**
 * Todo interface matching backend schema
 */
export interface ITodo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: Date;
  schoolId: string;
  userId: string;
  assignedTo?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create todo input interface
 */
export interface ICreateTodo {
  title: string;
  description: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: Date;
  schoolId: string;
  userId: string;
  assignedTo?: string;
}

/**
 * Update todo input interface
 */
export type IUpdateTodo = Partial<Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Todo filter interface
 */
export interface ITodoFilter {
  status?: TodoStatus;
  priority?: TodoPriority;
  startDate?: Date;
  endDate?: Date;
  assignedTo?: string;
}