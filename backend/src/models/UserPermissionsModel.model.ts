import { BaseModel } from "./base.models";
import { IPermissionListObj } from "./types/user-permissions";

class UserPermissionsModel extends BaseModel {
    async getByParams(params: any = {}) {
        const whereCondition = await this._buildWhereCondition(params);

        const includeObj = params.includeObj ? params.includeObj : null;
        return await this.prisma.userPermissions.findFirst({
            where: whereCondition,
            include: includeObj,
        });
    }

    async getAll(params: any = {}): Promise<Array<IPermissionListObj>> {
        const whereCondition = await this._buildWhereCondition(params);
        const includeObj = params.includeObj ? params.includeObj : null;

        return await this.prisma.userPermissions.findMany({
            where: whereCondition,
            include: includeObj,
        });
    }

    async _buildWhereCondition(params: any = {}) {
        const whereCondition: any = {};

        if (params.id) {
            whereCondition.id = params.id;
        }

        if (params.userId) {
            whereCondition.userId = params.userId;
        }

        if (params.moduleName) {
            whereCondition.moduleName = params.moduleName;
        }

        if (params.modulePermission) {
            whereCondition.modulePermission = params.modulePermission;
        }

        return whereCondition;
    }

    async create(data: any) {
        return await this.prisma.userPermissions.create({
            data,
        });
    }

    async update(id: number, data: any) {
        return await this.prisma.userPermissions.update({
            where: {
                id,
            },
            data,
        });
    }

    async updateMany(condition: any, data: any) {
        return await this.prisma.userPermissions.updateMany({
            where: condition,
            data,
        });
    }
}

export default UserPermissionsModel;
