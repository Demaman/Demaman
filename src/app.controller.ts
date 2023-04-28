import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create-user.dto';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { switchMap } from 'rxjs/operators';
import { readFileSync } from 'fs';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);
  private clientAdminBackend: ClientProxy;  

  constructor(){
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
          urls: ['amqp://guest:guest@127.0.0.1:5672/smartranking'],
          queue: 'admin-backend'
      }
    })
  }



@Post('user/')
@UsePipes(ValidationPipe)
async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
  try {
    const imagePath = join(__dirname, '..', '/src/avatars', createUserDto.avatarFilename);
    const buffer = readFileSync(imagePath);    
    const base64Image = buffer.toString('base64');
    createUserDto.avatar = base64Image;
    await this.clientAdminBackend.emit('create-user', createUserDto).toPromise();
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}



@Get('user/:_id')
@UsePipes(ValidationPipe)
consultUserById(
  @Param('_id') _id: string,
): Observable<any> {
  return this.clientAdminBackend.send(`consult-user/`, { id: _id }).pipe(
    switchMap((data) => {
      console.log('Result:', data);
      return of(data); // Return the received data as an Observable
    }),
  );
}

  
  @Get('user/:_id/avatar')
  @UsePipes(ValidationPipe)
  consultUserByIdAvatar(
    @Param('_id') _id: string,
  ): Observable<any> {
    return this.clientAdminBackend.send(`consult-user/avatar`, {id: _id});

  }

  @Delete('user/:_id')
  @UsePipes(ValidationPipe)
  deleteUserById(
    @Param('_id') _id: string,
  ): Observable<any> {
    return this.clientAdminBackend.emit(`delete-user/`, {id: _id});

  }


}
