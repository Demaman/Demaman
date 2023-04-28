import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; 
import { DeleteResult, MongoRepository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {ObjectId} from 'mongodb'

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MongoRepository<User>;

  beforeEach(async () => {
    const module: TestingModule =  await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          host: 'localhost',
          port: 27017,
          database: 'user_management',
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<MongoRepository<User>>(getRepositoryToken(User));
  });

  describe('signUp', () => {
    it('should create a new user when given valid input', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
      };
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
  
      const result = new User();
      result._id = new ObjectId()
      result.username = createUserDto.username;
      result.email = createUserDto.email;
      result.password = hashedPassword;
  
      jest.spyOn(userRepository, 'save').mockResolvedValue(result);
  
      const userCreated = await userService.signUp(createUserDto);
      expect(userCreated).toBe(result._id);
    });

    it('should throw a ConflictException when trying to create an existing user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
      };

       expect(userService.signUp(createUserDto)).rejects.toThrow(
        new ConflictException('The user already exists'),
      );
    });
  });

describe('consultUserById', () => {
    it('should throw a NotFoundException when the user with the given id does not exist', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException('User not found'));

       expect(userService.consultUserById('123')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('consultUserByIdAvatar', () => {
    it('should return the user avatar with the given id if it exists', async () => {
      const user = new User();
      user._id = new ObjectId();
      user.avatar = 'avatar.png';

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValue(user);

      const result =  await userService.consultUserByIdAvatar(user._id.toHexString());
      expect(result).toEqual(user.avatar);
    });

    it('should throw a NotFoundException when the user avatar with the given id does not exist', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException('Avatar not found'));

       expect(userService.consultUserByIdAvatar('123')).rejects.toThrow(
        new NotFoundException('Avatar not found'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with the given id if it exists', async () => {
      const user = new User();
      user._id = new ObjectId()
    
      jest.spyOn(userRepository, 'delete').mockResolvedValueOnce({ affected: 1, raw: null });
    
      const result =  await userService.deleteUser(user._id.toHexString());
      expect(result).toEqual(true);
    });
    
    it('should throw an InternalServerErrorException if there is a problem deleting the user', async () => {
      jest.spyOn(userRepository, 'delete').mockRejectedValueOnce(new Error());

       expect(userService.deleteUser('123')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});