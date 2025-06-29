/**
 * Bus attendance interface matching backend schema
 */
export interface IBusAttendance {
  id: string;
  studentId: string;
  busId: string;
  date: Date;
  status: BusAttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bus attendance status enum
 */
export enum BusAttendanceStatus {
  BOARDED = 'BOARDED',
  ALIGHTED = 'ALIGHTED'
}

/**
 * Create bus attendance input interface
 */
export interface ICreateBusAttendance {
  studentId: string;
  busId: string;
  status: BusAttendanceStatus;
}

/**
 * Update bus attendance input interface
 */
export type IUpdateBusAttendance = Partial<Omit<IBusAttendance, 'id' | 'createdAt' | 'updatedAt'>>