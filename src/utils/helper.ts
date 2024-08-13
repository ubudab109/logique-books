import { Response } from 'express';
import { ResponseI } from '../interface/response.interface';

export const sendResponse = (res: Response, statusCode: number, message: string, data?: any): void => {
  const response: ResponseI = { message, data };
  res.status(statusCode).json(response);
};