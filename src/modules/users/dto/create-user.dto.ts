import { Optional } from "@nestjs/common";
import { IsEmail, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {

    // @IsNumber()
    // @Optional()
    // id: number;

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
