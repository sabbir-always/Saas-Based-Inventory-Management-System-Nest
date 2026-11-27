import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateSuppliersDto {
    @IsOptional() @IsDateString()
    date_and_time: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50)
    supplier_name: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(11) @MaxLength(11)
    @Matches(/^01[3-9]\d{8}$/, { message: 'Invalid Bangladeshi phone number' })
    supplier_phone: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail() @IsNotEmpty() @MaxLength(50)
    supplier_email: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MinLength(3) @MaxLength(250)
    supplier_address: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MinLength(3) @MaxLength(250)
    warehouse_name: string;
}

export class UpdateSuppliersDto extends CreateSuppliersDto {
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class SuppliersQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @Transform(({ value }) => (value === '' || value === null ? undefined : value))
    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}