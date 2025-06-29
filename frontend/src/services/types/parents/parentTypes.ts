/**
 * Parent interface matching backend schema
 */
export interface IParent {
  id: string;
  userId: string;
  students: IStudent[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parent user details interface
 */
export interface IParentUserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType?: string;
  sex: UserSex;
  reputation: number;
  coins: number;
  redeemedBalance: number;
  role: 'parent';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User sex enum
 */
export enum UserSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS'
}

/**
 * Create parent input interface
 */
export interface ICreateParent {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType?: string;
  sex: UserSex;
  studentIds: string[];
}

/**
 * Update parent input interface
 */
export type IUpdateParent = Partial<Omit<IParentUserDetails, 'id' | 'role' | 'createdAt' | 'updatedAt'>>

/**
 * Parent student interface
 */
export interface IParentStudent {
  id: string;
  academicYear: string;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  fees: {
    paid: number;
    pending: number;
    total: number;
  };
}
