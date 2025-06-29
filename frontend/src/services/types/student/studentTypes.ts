/**
 * Student status enum
 */
export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  TRANSFERRED = 'TRANSFERRED',
  SUSPENDED = 'SUSPENDED'
}

/**
 * Student sex enum
 */
export enum StudentSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

/**
 * Student base interface
 */
export interface IStudentBase {
  academicYear: string;
  admissionNo: string;
  admissionDate: string;
  rollNo: string;
  status: StudentStatus;
  dateOfBirth: string;
  religion: string;
  category: string;
  caste: string;
  motherTongue: string;
  languagesKnown: string[];
  fatherName: string;
  fatherEmail: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherEmail: string;
  motherPhone: string;
  motherOccupation: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
  guardianAddress?: string;
  areSiblingsStudying: boolean;
  siblingName?: string;
  siblingClass?: string;
  siblingRollNo?: string;
  siblingAdmissionNo?: string;
  currentAddress: string;
  permanentAddress: string;
  vehicleNumber?: string;
  routeId?: string;
  busStopId?: string;
  hostelName?: string;
  roomNumber?: string;
  medicalCertificate?: string;
  transferCertificate?: string;
  medicalCondition?: string;
  allergies?: string;
  medicationName?: string;
  schoolId: string;
  classId: string;
  busId?: string;
}

/**
 * Student interface with system-generated fields
 */
export interface IStudent extends IStudentBase {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  class: IClass;
  route?: IRoute;
  busStop?: IBusStop;
  user: IStudentUser;
}

/**
 * Student user interface
 */
export interface IStudentUser {
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
  sex: StudentSex;
  reputation: number;
  coins: number;
  redeemedBalance: number;
  role: 'student';
  lastOnline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Class interface
 */
export interface IClass {
  id: string;
  name: string;
  roomNumber?: string;
  capacity: number;
  section: string;
  schoolId: string;
}

/**
 * Route interface
 */
export interface IRoute {
  id: string;
  name: string;
  description?: string;
  busId: string;
  schoolId: string;
}

/**
 * Bus stop interface
 */
export interface IBusStop {
  id: string;
  name: string;
  location: string;
  routeId: string;
  arrivalTime: string;
  departureTime: string;
}

/**
 * Student creation input interface
 */
export interface ICreateStudent extends IStudentBase {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType?: string;
  sex: StudentSex;
  profilePic?: File;
}

/**
 * Student update input interface
 */
export type IUpdateStudent = Partial<Omit<IStudent, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
  profilePic?: File;
}>;

/**
 * Student filter interface
 */
export interface IStudentFilter {
  status?: StudentStatus;
  class?: string;
  section?: string;
  admissionDateStart?: Date;
  admissionDateEnd?: Date;
  route?: string;
  hostel?: string;
}