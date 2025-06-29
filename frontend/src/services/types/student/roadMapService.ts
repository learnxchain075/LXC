/**
 * Roadmap interface matching backend schema
 */
export interface IRoadmap {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  topics: ITopic[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Topic interface
 */
export interface ITopic {
  id: string;
  title: string;
  description: string;
  order: number;
  status: TopicStatus;
  roadmapId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Topic status enum
 */
export enum TopicStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Create roadmap input interface
 */
export interface ICreateRoadmap {
  title: string;
  description: string;
  subjectId: string;
  topics: {
    title: string;
    description: string;
    order: number;
  }[];
}

/**
 * Update roadmap input interface
 */
export type IUpdateRoadmap = Partial<Omit<IRoadmap, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Create topic input interface
 */
export interface ICreateTopic {
  title: string;
  description: string;
  order: number;
  roadmapId: string;
}

/**
 * Update topic input interface
 */
export type IUpdateTopic = Partial<Omit<ITopic, 'id' | 'createdAt' | 'updatedAt'>>