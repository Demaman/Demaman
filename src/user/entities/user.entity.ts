import { Entity, Column, ObjectIdColumn, ObjectId, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Repository } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Unique(['username'])
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarFilename?: string;

  @Column({nullable: true})
  avatar?: string;
}

export class UserRepository extends Repository<User> {}
