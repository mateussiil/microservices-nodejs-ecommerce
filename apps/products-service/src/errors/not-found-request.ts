import { Response } from "express";

export const NotFoundError = (res:Response) => {
  return res.status(400).send({ message: 'Not found' })
}