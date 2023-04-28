import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        {message: 
            "The password is weak, it must contain at leat 8 characters one Upper case, numbers and especial character"
        })
    password: string;

    @IsOptional()
    readonly avatarFilename?: string;

    @IsOptional()
    avatar?: string;
}
