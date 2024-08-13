import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendResponse } from '../utils/helper';

/**
 * The `validationHandler` function in TypeScript is used to validate request data using a DTO class
 * and return error messages if validation fails.
 * @param {any} dtoClass - The `dtoClass` parameter in the `validationHandler` function is the Data
 * Transfer Object (DTO) class that defines the structure and validation rules for the data that is
 * expected in the request body. It is used to create an instance of the DTO class from the request
 * body and validate it before proceeding
 * @returns The validationHandler function returns a middleware function that takes in the request,
 * response, and next function as parameters. Inside this middleware function, it validates the request
 * body based on the provided DTO class using the plainToInstance and validate functions. If there are
 * validation errors, it sends a response with status code 422 and the error messages. Otherwise, it
 * calls the next function to proceed with the next middleware
 */
export const validationHandler = (dtoClass: any) => async (req: Request, res: Response, next: NextFunction) => {
  const dtoInstance = plainToInstance(dtoClass, req.body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
    return sendResponse(res, 422, 'Validation Error', errorMessages);
  }

  next();
};
