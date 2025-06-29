import express, { Request, Response } from "express";
import { FeaturesListObj } from "../../../../constants";
import SchoolFeatureRequestsModel from "../../../../models/SchoolFeatureRequestsModel.model";
import UserModel from "../../../../models/UserModel.model";
import UserPermissionsModel from "../../../../models/UserPermissionsModel.model";
import { getErrorMessage } from "../../../../utils/common_utils";



const router = express.Router();

router.get("/features/get-all", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const userModelObj = new UserModel();
    const userPermissionsModelObj = new UserPermissionsModel();
    const schoolFeatureRequestsModelObj = new SchoolFeatureRequestsModel();

    const userObj = await userModelObj.getByParams({
      id: userId,
    });

    if (!userObj) {
      throw new Error("User id is invalid");
    }

    const returnPermissionsList = [];
    for (const feature of FeaturesListObj) {
      const permissionObj = await userPermissionsModelObj.getByParams({ moduleName: feature.name, userId: userId });
      const schoolFeatureRequestRecordObj = await schoolFeatureRequestsModelObj.getByParams({
        userId: userId,
        moduleName: feature.name,
      });

      returnPermissionsList.push({
        moduleName: feature.name,
        permission: permissionObj ? 1 : 0,
        status: schoolFeatureRequestRecordObj ? 1 : 0,
      });
    }

    const returnObj = {
      featuresList: returnPermissionsList,
    };

    res.status(200).json({ message: "all permissions", ...returnObj });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
});

router.post("/features/request", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const schoolId = req.user!.schoolId;
    const moduleName = req.body.moduleName as string;

    const schoolFeatureRequestsModelObj = new SchoolFeatureRequestsModel();

    await schoolFeatureRequestsModelObj.create({
      userId: userId,
      schoolId: schoolId,
      moduleName: moduleName,
      status: 0,
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: getErrorMessage(err) });
  }
});

export default router;
