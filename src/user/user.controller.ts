import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { User } from './entities/user.entity';

@Controller('auth')
export class UserController {
    constructor(private userService: UserService){}
    
    @EventPattern('create-user')
    async signUp(@Payload() userCredentailsDto: CreateUserDto): Promise<ObjectId>{
        try {
            const result = await this.userService.signUp(userCredentailsDto);
            return result;
        } catch (error) {
            console.log(error)
            throw new Error(error.message); // Throw an error with the error message received
        }
    }

    @MessagePattern('consult-user/')
    async consultUserById(@Payload() _id: string): Promise<User>{
        try {
            const result = await this.userService.consultUserById(_id);
            return result;
        } catch (error) {
            throw new Error(error.message); // Throw an error with the error message received
        }
    }

    @MessagePattern('consult-user/avatar')
    async consultUserByIdAvatar(@Payload() _id: string): Promise<string>{
        try {
            const result = await this.userService.consultUserByIdAvatar(_id);
            return result;
        } catch (error) {
            throw new Error(error.message); // Throw an error with the error message received
        }
    }

    @EventPattern('delete-user/')
    async deleteUser(id: string): Promise<boolean> {
      try {
          const deleted = await this.userService.deleteUser(id);
          return deleted;
      } catch (error) {

            throw new Error(error.message); // Throw an error with the error message received
        }
    }
    
}
