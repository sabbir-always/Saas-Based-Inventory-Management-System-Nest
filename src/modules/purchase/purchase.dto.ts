import { Transform, Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreatePurchaseDto {
    @IsOptional() @IsDateString()
    date_and_time: string;

    @IsMongoId() @IsNotEmpty()
    products_id: string;

    @IsMongoId() @IsNotEmpty()
    suppliers_id: string;

    @Type(() => Number) @IsInt() @Min(1)
    quantity: number;

    @Type(() => Number) @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
    price: number;

    @Type(() => Number) @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
    shipping_cost: number;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MinLength(3) @MaxLength(200)
    notes: string;
}

export class UpdatePurchaseDto extends CreatePurchaseDto {}

export class PurchaseQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @IsOptional() @IsMongoId()
    products_id: string;

    @IsOptional() @IsMongoId()
    suppliers_id: string;

    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}