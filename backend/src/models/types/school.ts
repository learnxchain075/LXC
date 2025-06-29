import { School, User } from "@prisma/client";

export interface ISchool extends School {
  user?: User;
}

export interface ICreateSchool {
  schoolName: string;
  userId: string;
}

export interface IUpdateSchool {
  id: string;
  schoolName?: string;
  updatedAt?: Date;
}

export interface ISchoolQueryParams {
  id?: string;
  userId?: string;
  schoolName?: string;
}
