/**
 * Pickup point interface matching backend schema
 */
export interface IPickUpPoint {
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
 * Create pickup point input interface
 */
export interface ICreatePickUpPoint {
  name: string;
  location: string;
  routeId: string;
  schoolId: string;
}

/**
 * Update pickup point input interface
 */
export type IUpdatePickUpPoint = Partial<Omit<IPickUpPoint, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Pickup point status enum
 */
export enum PickupPointStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

/**
 * Pickup point assignment interface
 */
export interface IPickupPointAssignment {
  pickupPointId: string;
  studentId: string;
  routeId: string;
}
