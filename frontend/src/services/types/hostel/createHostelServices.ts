import { IStudent } from '../admin/studentServices';

/**
 * Room type enum
 */
export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  DORMITORY = 'DORMITORY'
}

/**
 * Room status enum
 */
export enum RoomStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

/**
 * Request status enum
 */
export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * Fee status enum
 */
export enum FeeStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL'
}

/**
 * Fee type enum
 */
export enum FeeType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'
}

/**
 * Complaint status enum
 */
export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

/**
 * Student interface for hostel
 */
export interface IHostelStudent {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate?: Date;
}

/**
 * Hostel interface matching backend schema
 */
export interface IHostel {
  id: string;
  hostelName: string;
  location?: string;
  capacity: number;
  schoolId: string;
  userId?: string;
  rooms: IRoom[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Room interface
 */
export interface IRoom {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  hostelId: string;
  students: IHostelStudent[];
  inventories: IInventory[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Inventory interface
 */
export interface IInventory {
  id: string;
  name: string;
  quantity: number;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create hostel input interface
 */
export interface ICreateHostel {
  hostelName: string;
  location?: string;
  capacity: number;
  schoolId: string;
  rooms?: {
    number: string;
    type: RoomType;
  }[];
}

/**
 * Update hostel input interface
 */
export type IUpdateHostel = Partial<Omit<IHostel, 'id' | 'createdAt' | 'updatedAt' | 'rooms'>>

/**
 * Create room input interface
 */
export interface ICreateRoom {
  number: string;
  type: RoomType;
  hostelId: string;
  inventories?: {
    name: string;
    quantity: number;
  }[];
}

/**
 * Update room input interface
 */
export type IUpdateRoom = Partial<Omit<IRoom, 'id' | 'createdAt' | 'updatedAt' | 'students' | 'inventories'>>

/**
 * Room allocation request interface
 */
export interface IRoomAllocationRequest {
  studentId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  remarks?: string;
}

/**
 * Room allocation response interface
 */
export interface IRoomAllocationResponse {
  success: boolean;
  message: string;
  allocation?: {
    id: string;
    studentId: string;
    roomId: string;
    checkInDate: Date;
    checkOutDate?: Date;
    status: RequestStatus;
    createdAt: Date;
  };
}

