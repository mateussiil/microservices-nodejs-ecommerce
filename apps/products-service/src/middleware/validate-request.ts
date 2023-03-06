import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { BadRequestError } from '../errors/bad-request';

const validate = (schema: yup.AnyObject) => async (req:Request, res:Response, next:NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err: any) {
    return BadRequestError(res, err.message);
  }
};

export { validate }