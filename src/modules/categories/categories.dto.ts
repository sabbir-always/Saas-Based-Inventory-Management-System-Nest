import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateCategoriesDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(30)
    categories_name: string;
}

export class UpdateCategoriesDto extends CreateCategoriesDto {
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class CategoriesQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @Transform(({ value }) => (value === '' || value === null ? undefined : value))
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}