import { Response } from "express";

export const ServerError = (res:Response, message:string) => {
  return res.status(500).send({ message })
}