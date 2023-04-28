import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'user_management',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), UserModule
  ],
})
export class AppModule {}
