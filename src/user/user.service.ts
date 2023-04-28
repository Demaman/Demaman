/**
 * This service handles the user related logic such as registration, user retrieval, and deletion.
 */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  /**
   * Creates a new user record in the database.
   *
   * @param userCredentialsDto The DTO containing the user credentials.
   *
   * @returns The ID of the new user that was created.
   *
   * @throws `ConflictException` if a user with the given username or email already exists.
   */
  async signUp(userCredentialsDto: CreateUserDto): Promise<ObjectId> {
    const { username, password, email, avatarFilename, avatar } =
      userCredentialsDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    if (avatarFilename && avatar) {
      user.avatar = avatar;
      user.avatarFilename = avatarFilename;
    }
    try {
      const result = await this.userRepository.save(user);
      return result._id;
    } catch (error) {
      throw new ConflictException('The user already exists');
    }
  }

  /**
   * Retrieves a user's record from the database using their ID.
   *
   * @param id The ID of the user to retrieve.
   *
   * @returns The user's details.
   *
   * @throws `NotFoundException` if no user was found with the given ID.
   */
  async consultUserById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { _id: new ObjectId(id) },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Retrieves a user's avatar from the database using their ID.
   *
   * @param id The ID of the user whose avatar to retrieve.
   *
   * @returns The binary data of the user's avatar.
   *
   * @throws `NotFoundException` if no user was found with the given ID.
   */
  async consultUserByIdAvatar(id: string): Promise<string> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { _id: new ObjectId(id) },
      });
      return user.avatar;
    } catch (error) {
      throw new NotFoundException('Avatar not found');
    }
  }

  /**
   * Deletes a user's record from the database using their ID.
   *
   * @param id The ID of the user to delete.
   *
   * @returns `true` if the user was successfully deleted, `false` otherwise.
   *
   * @throws `InternalServerErrorException` if an error occurred while attempting to delete the user.
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userRepository.delete({ _id: new ObjectId(id) });
      if(result.affected > 0){
        return true
      }else{
        return false
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
