import { Transform, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateUsersDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(30)
    first_name: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(30)
    last_name: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail() @IsNotEmpty() @MaxLength(50)
    email: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(20)
    @Matches(/^[0-9+\-\s]+$/, { message: 'phone must contain only numbers, +, - and spaces' })
    phone: string;

    @IsString() @IsNotEmpty() @MinLength(6) @MaxLength(50)
    password: string;
}

export class UpdateUsersDto extends CreateUsersDto {
    @IsOptional() @IsIn(['superadmin', 'admin', 'anonymous'])
    role: 'superadmin' | 'admin' | 'anonymous';

    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}

export class ChangePasswordDto {
    @IsString() @IsNotEmpty() @MinLength(6) @MaxLength(50)
    old_password: string;

    @IsString() @IsNotEmpty() @MinLength(6) @MaxLength(50)
    new_password: string;
}

export class LoginDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail() @IsNotEmpty()
    email: string;

    @IsString() @IsNotEmpty()
    password: string;
}

export class UsersQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @IsOptional() @IsIn(['superadmin', 'admin', 'anonymous'])
    role: 'superadmin' | 'admin' | 'anonymous';

    @IsOptional() @IsIn(['active', 'inactive'])
    status: 'active' | 'inactive';
}