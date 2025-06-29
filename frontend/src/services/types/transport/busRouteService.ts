/**
 * Route interface matching backend schema
 */
export interface IRoute {
  id: string;
  name: string;
  busId: string;
  schoolId: string;
  busStops?: IBusStop[];
  students?: IStudent[];
  pickUpPoints?: IPickUpPoint[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create route input interface
 */
export interface ICreateRoute {
  name: string;
  busId: string;
  schoolId: string;
}

/**
 * Update route input interface
 */
export type IUpdateRoute = Partial<Omit<IRoute, 'id' | 'createdAt' | 'updatedAt'>>