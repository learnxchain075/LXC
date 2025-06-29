/**
 * Conductor interface matching backend schema
 */
export interface IConductor {
  id: string;
  name: string;
  busId: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create conductor input interface
 */
export interface ICreateConductor {
  name: string;
  busId: string;
  schoolId: string;
}

/**
 * Update conductor input interface
 */
export type IUpdateConductor = Partial<Omit<IConductor, 'id' | 'createdAt' | 'updatedAt'>>