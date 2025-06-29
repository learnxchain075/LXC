import { Request, Response } from 'express';

import { getJwtToken, validateRefreshToken } from '../../utils/jwt_utils';
import UserModel from '../../models/UserModel.model';
import { CONFIG } from '../../config';
import { getErrorMessage } from '../../utils/common_utils';
import { refreshTokenSchema } from '../../validations/auth/signinValidation';

export const refreshTokenHandler = async (req: Request, res: Response): Promise<any> => {
    const parseResult = refreshTokenSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }

    try {
      const { token } = parseResult.data;
  
      const refreshTokenData = await validateRefreshToken(token);
  
      const usersModelObj = new UserModel();
      const userObj = await usersModelObj.getByParams({
        id: refreshTokenData.user!.userId,
        isActive: 1,
      });
  
      if (!userObj) {
        throw new Error("Invalid user account");
      }
  
      const accessToken = await getJwtToken(
        { userId: userObj.id, email: userObj.email, role: userObj.role },
        CONFIG.JWT_LOGIN_TOKEN_EXPIRY_TIME,
        false
      );
  
      const refreshToken = await getJwtToken(
        { userId: userObj.id, email: userObj.email, role: userObj.role },
        CONFIG.JWT_REFRESH_TOKEN_EXPIRY_TIME,
        true
      );
  
      res.status(200).send({ success: "ok", accessToken, refreshToken });
    } catch (error) {
      res.status(401).send({ success: "error", errors: getErrorMessage(error) });
    }
  };