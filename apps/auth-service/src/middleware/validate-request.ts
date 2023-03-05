import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

const validate = (schema: yup.AnyObject) => async (req:Request, res:Response, next:NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err: any) {
    return res.status(500).json({ type: err.name, message: err.message });
  }
};

export { validate }