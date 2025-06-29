/**
 * Transport interface matching backend schema
 */
export interface ITransport {
  id: string;
  schoolId: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transport assignment interface
 */
export interface ITransportAssignment {
  busId: string;
  routeId: string;
  busStopId: string;
  pickupPointId?: string;
  studentId: string;
}

/**
 * Transport status enum
 */
export enum TransportStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

/**
 * Transport report interface
 */
export interface ITransportReport {
  totalBuses: number;
  activeBuses: number;
  totalRoutes: number;
  totalStudents: number;
  busUtilization: {
    busId: string;
    busNumber: string;
    capacity: number;
    currentOccupancy: number;
    utilizationPercentage: number;
  }[];
  routeWiseStats: {
    routeId: string;
    routeName: string;
    totalStops: number;
    totalStudents: number;
  }[];
}