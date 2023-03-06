import { Response } from "express";

export const NotAuthorizedError = (res: Response) => {
  return res.status(401).send({ message: 'Not authorized' })
}