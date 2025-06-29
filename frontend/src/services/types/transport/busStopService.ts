/**
 * Bus stop interface matching backend schema
 */
export interface IBusStop {
  id: string;
  name: string;
  location: string;
  routeId: string;
  schoolId: string;
  students?: IStudent[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create bus stop input interface
 */
export interface ICreateBusStop {
  name: string;
  location: string;
  routeId: string;
  schoolId: string;
}

/**
 * Update bus stop input interface
 */
export type IUpdateBusStop = Partial<Omit<IBusStop, 'id' | 'createdAt' | 'updatedAt'>>