import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    email: string;

    @IsOptional()
    readonly avatarFilename?: string;

    @IsOptional()
    avatar?: string;
}