import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '@config/index.config';
import { IUser } from '../interfaces/IEntity';
import Role from '@models/role.model';
import User from '../models/user.model';

export interface CustomRequest extends Request {
  user?: IUser
  token?: string
}
export interface CustomResponse extends Response {
  roleId?: number
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Invalid token' });
      return
    }
    req.user = user;
    next();
  });
};

const checkRole = (allowedRoles: number) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return
      }
      const role = await Role.findOne({ roleId: req.user.roleId });
      if (role.roleId !== allowedRoles) {
        res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
        return
      }

      next()
    } catch (error) {
      res.status(500).json({ success: false, message: 'Check Role Fail' })
      return
    }
  }

};

export { authMiddleware, checkRole }