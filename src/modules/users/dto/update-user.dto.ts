import { IsNumber, IsString } from "class-validator";

export class UpdateUserDto {

    @IsString()
    name?: string;
}
