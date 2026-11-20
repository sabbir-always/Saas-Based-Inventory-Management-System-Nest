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

export class CreateCategoriesDto {
    @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    categories_name: string;
}

export class UpdateCategoriesDto extends CreateCategoriesDto {
    @IsOptional()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class CategoriesQueryDto extends PaginationDto {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    @IsString()
    @MaxLength(100)
    search: string;

    @IsOptional()
    @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}