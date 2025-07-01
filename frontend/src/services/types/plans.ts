/**
 * Plan type enum
 */
export enum PlanType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

/**
 * Plan interface matching backend schema
 */
export interface IPlan {
  id: string;
  name: string;
  price: number;
  userLimit: number;
  durationDays: number;
  type: PlanType;
  discountedPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  features?: string[];
}

/**
 * Create plan input interface
 */
export interface ICreatePlan {
  name: string;
  price: number;
  userLimit: number;
  durationDays: number;
  type?: PlanType;
  discountedPrice?: number;
  description?: string;
  features?: string[];
}

/**
 * Update plan input interface
 */
export type IUpdatePlan = Partial<Omit<IPlan, 'id' | 'createdAt' | 'updatedAt'>>;
