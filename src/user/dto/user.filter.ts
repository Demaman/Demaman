import {
    Catch,
    ExceptionFilter,
    HttpStatus,
    InternalServerErrorException,
  } from '@nestjs/common';
  
@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  catch(error: Error, host) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    if (error.message === 'The user already exists') {
      response
        .status(HttpStatus.CONFLICT)
        .json({ message: 'A user with that email or username already exists' });
    } else if (error.message === 'User not found') {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    } else if (error.message === 'Avatar not found') {
      response.status(HttpStatus.NOT_FOUND).json({ message: 'Avatar not found' });
    } else if (error instanceof InternalServerErrorException) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An internal server error occurred' });
    } else {
      // If the error is not handled specifically, return a generic error message
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Something went wrong' });
    }
  }
}
