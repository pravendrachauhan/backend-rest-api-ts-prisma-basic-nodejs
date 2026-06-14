import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class GetUserFilteringDto {

    
    @IsOptional()
    @IsString()
    @ApiProperty({required: true, description: 'Name to filter users by'})
    name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({required: false, description: 'Page number for pagination', default: 1})
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({required: false, description: 'Number of items to return per page', default: 10})
    limit?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({required: false, description: 'Sort order for results', default: 'asc'})
    sortBy?: string;
}
