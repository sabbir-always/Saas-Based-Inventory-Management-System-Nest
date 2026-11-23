import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateProductDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(20)
    product_model: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(20)
    product_brand: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50)
    product_name: string;

    @IsMongoId() @IsNotEmpty()
    categories_id: string;

    @IsMongoId() @IsNotEmpty()
    unittypes_id: string;

    @Type(() => Number) @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
    purchase_price: number;

    @Type(() => Number) @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
    selling_price: number;
}

export class UpdateProductDto extends CreateProductDto {
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class ProductQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @IsOptional() @IsMongoId()
    categories_id: string;

    @IsOptional() @IsMongoId()
    unittypes_id: string;

    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}