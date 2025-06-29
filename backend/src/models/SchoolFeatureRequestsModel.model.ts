import { BaseModel } from "./base.models";

class SchoolFeatureRequestsModel extends BaseModel {
    async getByParams(params: any = {}) {
        const whereCondition = await this._buildWhereCondition(params);

        const includeObj = params.includeObj ? params.includeObj : null;
        return await this.prisma.schoolFeatureRequests.findFirst({
            where: whereCondition,
            include: includeObj,
        });
    }

    async getAll(params: any = {}) {
        const whereCondition = await this._buildWhereCondition(params);
        const includeObj = params.includeObj ? params.includeObj : null;

        return await this.prisma.schoolFeatureRequests.findMany({
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

        if (params.schoolId) {
            whereCondition.schoolId = params.schoolId;
        }

        return whereCondition;
    }

    async create(data: any) {
        return await this.prisma.schoolFeatureRequests.create({
            data,
        });
    }

    async update(id: string, data: any) {
        return await this.prisma.schoolFeatureRequests.update({
            where: {
                id,
            },
            data,
        });
    }

    async updateMany(condition: any, data: any) {
        return await this.prisma.schoolFeatureRequests.updateMany({
            where: condition,
            data,
        });
    }
}

export default SchoolFeatureRequestsModel;
