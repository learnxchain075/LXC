import { BaseModel } from "./base.models";

class UserModel extends BaseModel {
  async getByParams(params: any = {}) {
    const whereCondition = await this._buildWhereCondition(params);

    return await this.prisma.user.findFirst({
      where: whereCondition,
    });
  }

  async getAll(params: any = {}) {
    const whereCondition = await this._buildWhereCondition(params);

    return await this.prisma.user.findMany({
      where: whereCondition,
    });
  }

  async _buildWhereCondition(params: any = {}) {
    const whereCondition: any = {};

    const fieldsForWhere = ["id"];

    fieldsForWhere.forEach((field) => {
      if (params[field]) {
        whereCondition[field] = params[field];
      }
    });

    return whereCondition;
  }
}

export default UserModel;
