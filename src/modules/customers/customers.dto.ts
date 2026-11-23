import { Transform, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateCustomersDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50)
    customer_name: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(20)
    @Matches(/^[0-9+\-\s]+$/, { message: 'customer_phone must contain only numbers, +, - and spaces' })
    customer_phone: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail() @IsNotEmpty() @MaxLength(50)
    customer_email: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MinLength(3) @MaxLength(250)
    customer_address: string;
}

export class UpdateCustomersDto extends CreateCustomersDto {
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class CustomersQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}