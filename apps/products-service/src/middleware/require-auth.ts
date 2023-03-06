import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';


export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  console.log(req.currentUser)
  //@ts-ignore
  if (!req.currentUser) {
    return NotAuthorizedError(res);
  }

  next();
};