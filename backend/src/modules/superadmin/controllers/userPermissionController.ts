import { Request, Response } from "express";

import UserModel from "../../../models/UserModel.model";
import UserPermissionsModel from "../../../models/UserPermissionsModel.model";
import { getErrorMessage } from "../../../utils/common_utils";
import { IUpdateUserPermissions } from "../../../models/types/user-permissions";
import {
  userIdParamSchema,
  updatePermissionsSchema,
  sharePermissionSchema,
} from "../../../validations/Module/SuperadminDashboard/userPermissionValidation";

export const getUserPermissionsById = async (req: Request, res: Response) => {
  try {
    const paramCheck = userIdParamSchema.safeParse(req.params);
    if (!paramCheck.success) {
      throw new Error("User id is invalid");
    }

    const userId = paramCheck.data.userId;

    const userModelObj = new UserModel();
    const userPermissionsModelObj = new UserPermissionsModel();

    const userObj = await userModelObj.getByParams({
      id: userId,
    });

    if (!userObj) {
      throw new Error("User id is invalid");
    }

    const permissionsList = await userPermissionsModelObj.getAll({
      userId: userId,
    });

    const returnPermissionsList = permissionsList.map((obj) => {
      const allPermissions = obj.modulePermission.split("").map((value) => parseInt(value));

      return {
        id: obj.id,
        module: obj.moduleName,
        access: allPermissions.includes(1),
        permission: {
          create: allPermissions[0],
          read: allPermissions[1],
          update: allPermissions[2],
          delete: allPermissions[3],
          managePermissions: allPermissions[4],
        },
      };
    });

    const returnObj = {
      permissions: returnPermissionsList,
    };

    res.status(200).json({ message: "all permissions", ...returnObj });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
};

export const updateUserPermissions = async (req: Request, res: Response):Promise<any> => {
  try {
    const paramCheck = userIdParamSchema.safeParse(req.params);
    if (!paramCheck.success) {
      return res.status(400).json({ message: "Invalid user id", errors: paramCheck.error.errors });
    }

    const body = updatePermissionsSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
    }

    const userId = paramCheck.data.userId;
    const updateData = body.data.permissions as Array<IUpdateUserPermissions>;

    const userModelObj = new UserModel();
    const userPermissionsModelObj = new UserPermissionsModel();

    const userObj = await userModelObj.getByParams({
      id: userId,
    });

    if (!userObj) {
      throw new Error("User id is invalid");
    }

    for (let i = 0; i < updateData.length; i++) {
      const permissionObj = updateData[i];
      const existingPermissionObj = await userPermissionsModelObj.getByParams({
        id: permissionObj.id,
      });

      if (existingPermissionObj) {
        const newPermissionArray: Array<number> = [];

        if (permissionObj.permission.create === 0 || permissionObj.permission.create === 1) {
          newPermissionArray.push(permissionObj.permission.create);
        }

        if (permissionObj.permission.read === 0 || permissionObj.permission.read === 1) {
          newPermissionArray.push(permissionObj.permission.read);
        }

        if (permissionObj.permission.update === 0 || permissionObj.permission.update === 1) {
          newPermissionArray.push(permissionObj.permission.update);
        }

        if (permissionObj.permission.delete === 0 || permissionObj.permission.delete === 1) {
          newPermissionArray.push(permissionObj.permission.delete);
        }

        // special type of module permission i.e. manage permission
        if (
          permissionObj.module === "user" &&
          (permissionObj.permission.managePermissions === 0 || permissionObj.permission.managePermissions === 1)
        ) {
          newPermissionArray.push(permissionObj.permission.managePermissions);
        }

        await userPermissionsModelObj.update(existingPermissionObj.id, {
          modulePermission: newPermissionArray.join(""),
        });
      }
    }

    const permissionsList = await userPermissionsModelObj.getAll({
      userId: userId,
    });

    const returnPermissionsList = permissionsList.map((obj) => {
      const allPermissions = obj.modulePermission.split("").map((value) => parseInt(value));

      return {
        guid: obj.guid,
        module: obj.moduleName,
        access: allPermissions.includes(1),
        permission: {
          create: allPermissions[0],
          read: allPermissions[1],
          update: allPermissions[2],
          delete: allPermissions[3],
          managePermissions: allPermissions[4],
        },
      };
    });

    const returnObj = {
      permissions: returnPermissionsList,
    };

    res.status(200).json({ message: "updated permissions", ...returnObj });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
};

export const sharePermissions = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = sharePermissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const { fromUserId, toUserId } = parsed.data;

    const userModel = new UserModel();
    const permissionModel = new UserPermissionsModel();

    const [fromUser, toUser] = await Promise.all([
      userModel.getByParams({ id: fromUserId }),
      userModel.getByParams({ id: toUserId }),
    ]);

    if (!fromUser) return res.status(404).json({ message: "From user not found" });
    if (!toUser) return res.status(404).json({ message: "To user not found" });

    const fromPermissions = await permissionModel.getAll({ userId: fromUserId });

    await Promise.all(
      fromPermissions.map(async (perm) => {
        const existing = await permissionModel.getByParams({
          userId: toUserId,
          moduleName: perm.moduleName,
        });

        if (existing) {
          return permissionModel.update(existing.id, {
            modulePermission: perm.modulePermission,
            status: perm.status,
          });
        } else {
          return permissionModel.create({
            userId: toUserId,
            moduleName: perm.moduleName,
            modulePermission: perm.modulePermission,
            status: perm.status,
          });
        }
      })
    );

    res.status(200).json({ message: "Permissions shared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
};
