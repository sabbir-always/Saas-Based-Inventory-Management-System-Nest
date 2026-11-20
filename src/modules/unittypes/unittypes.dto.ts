import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
}

export class CreateUnittypesDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    unittypes_name: string;
}

export class UpdateUnittypesDto extends CreateUnittypesDto {
    @IsOptional()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class UnittypesQueryDto extends PaginationDto {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MaxLength(100)
    search: string;

    @IsOptional()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}