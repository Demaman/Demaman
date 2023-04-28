import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { classToPlain } from 'class-transformer';
  
  @Injectable()
  export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
  
      return next.handle().pipe(
        map((data) => {
          // Check if the data is an instance of the User entity
          const isUserEntity =
            data && data.constructor && data.constructor.name === 'User';
  
          // If it is a User entity, transform it using classToPlain
          if (isUserEntity) {
            return classToPlain(data);
          }
  
          // Otherwise, return the original data
          return data;
        }),
      );
    }
  }
  