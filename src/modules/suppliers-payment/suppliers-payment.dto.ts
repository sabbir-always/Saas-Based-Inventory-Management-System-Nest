import { Transform, Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class PaginationDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;
}

export class CreateSupplierPaymentDto {
    @IsOptional() @IsDateString()
    date_and_time: string;

    @IsMongoId() @IsNotEmpty()
    purchases_id: string;

    @Type(() => Number) @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0)
    amount: number;

    @IsIn(['cash', 'bkash', 'nagad', 'bank', 'cheque', 'others'])
    payment_method: 'cash' | 'bkash' | 'nagad' | 'bank' | 'cheque' | 'others';

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MinLength(3) @MaxLength(200)
    notes: string;
}

export class UpdateSupplierPaymentDto extends CreateSupplierPaymentDto { }

export class SupplierPaymentQueryDto extends PaginationDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional() @IsString() @MaxLength(100)
    search: string;

    @IsOptional() @IsMongoId()
    purchases_id: string;
}