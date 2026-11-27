import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateUnittypesDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(20)
    unittypes_name: string;
}

export class UpdateUnittypesDto extends CreateUnittypesDto {
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class UnittypesQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @Transform(({ value }) => (value === '' || value === null ? undefined : value))
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}