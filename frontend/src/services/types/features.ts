import { yearsDisabledAfter } from "react-datepicker/dist/date_utils";

yearsDisabledAfter/**
 * Feature request status enum
 */
export enum FeatureRequestStatus {
  NOT_REQUESTED = 0,
  PENDING = 1,
  REJECTED = 2,
  APPROVED = 3
}

/**
 * Base response interface
 */
export interface IBaseResponse {
  success: boolean;
  error?: string;
}

/**
 * Feature object interface
 */
export interface IFeature {
  id: string;
  moduleName: string;
  permission: boolean;
  status: FeatureRequestStatus;
  requestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all features response interface
 */
export interface IGetAllFeaturesResponse extends IBaseResponse {
  features: IFeature[];
}

/**
 * Feature request object interface
 */
export interface IFeatureRequest {
  id: string;
  moduleName: string;
  schoolId: string;
  schoolName?: string;
  status: FeatureRequestStatus;
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all feature requests response interface
 */
export interface IGetAllFeatureRequestsResponse extends IBaseResponse {
  requests: IFeatureRequest[];
}

/**
 * Feature request approval response interface
 */
export interface IFeatureRequestApprovalResponse extends IBaseResponse {
  request: IFeatureRequest;
}

/**
 * Feature permission object interface
 */
export interface IFeaturePermission {
  id: string;
  moduleName: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all feature permissions response interface
 */
export interface IGetAllFeaturePermissionsResponse extends IBaseResponse {
  permissions: IFeaturePermission[];
}

/**
 * Feature permission toggle response interface
 */
export interface IFeaturePermissionToggleResponse extends IBaseResponse {
  permission: IFeaturePermission;
}
