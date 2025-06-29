/**
 * Driver interface matching backend schema
 */
export interface IDriver {
  id: string;
  name: string;
  license: string;
  busId: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create driver input interface
 */
export interface ICreateDriver {
  name: string;
  license: string;
  busId: string;
  schoolId: string;
}

/**
 * Update driver input interface
 */
export type IUpdateDriver = Partial<Omit<IDriver, 'id' | 'createdAt' | 'updatedAt'>>