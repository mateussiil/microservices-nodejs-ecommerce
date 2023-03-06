import { Response } from "express";

export const BadRequestError = (res:Response, message:string) => {
  return res.status(400).send({ message })
}