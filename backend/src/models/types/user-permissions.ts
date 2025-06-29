import { User, UserPermissions } from "@prisma/client";

export interface IPermissionListObj extends UserPermissions {
  user?: User;
}

export interface IUserPermission {
  [key: string]: IUserPermissionObj;
}

export interface IUserPermissionObj {
  access: boolean;
  permissions: IPermissionObj;
}

export interface IPermissionObj {
  create: number;
  read: number;
  update: number;
  delete: number;
  managePermissions: number;
}

export interface IUpdateUserPermissions {
  id: string;
  module: string;
  access: boolean;
  permission: IPermissionObj;
}
