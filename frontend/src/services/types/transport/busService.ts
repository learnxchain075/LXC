/**
 * Bus interface matching backend schema
 */
export interface IBus {
  id: string;
  busNumber: string;
  capacity: number;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  routes?: IRoute[];
  drivers?: IDriver[];
  conductors?: IConductor[];
  students?: IStudent[];
  busAttendance?: IBusAttendance[];
}

/**
 * Create bus input interface
 */
export interface ICreateBus {
  busNumber: string;
  capacity: number;
  schoolId: string;
}

/**
 * Update bus input interface
 */
export type IUpdateBus = Partial<Omit<IBus, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Bus status enum
 */
export enum BusStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}