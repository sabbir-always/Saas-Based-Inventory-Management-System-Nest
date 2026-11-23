import { Transform, Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateExpensesDto {
    @IsOptional() @IsDateString()
    date_and_time: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50)
    expense_name: string;

    @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01)
    amount: number;

    @IsIn(['cash', 'bkash', 'nagad', 'bank', 'cheque', 'others'])
    payment_method: 'cash' | 'bkash' | 'nagad' | 'bank' | 'cheque' | 'others';

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MinLength(3) @MaxLength(200)
    notes: string;
}

export class UpdateExpensesDto extends CreateExpensesDto { }

export class ExpensesQueryDto extends PaginationDto {
    @IsOptional() @IsDateString()
    from_date: string;

    @IsOptional() @IsDateString()
    to_date: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @IsOptional() @IsIn(['cash', 'bkash', 'nagad', 'bank', 'cheque', 'others'])
    payment_method: 'cash' | 'bkash' | 'nagad' | 'bank' | 'cheque' | 'others';
}