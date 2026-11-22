import { ConflictException } from '@nestjs/common';

export const MongooseExceptionError = (error: any): never => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue ?? {})[0] ?? 'Field';
        throw new ConflictException(`${field} already exists`);
    }
    throw error;
}

export const CreatePagination = (page: number, limit: number, count: number) => {
    return {
        per_page: limit,
        current_page: page,
        total_data: count,
        total_page: Math.ceil(count / limit),
        previous: page - 1 > 0 ? page - 1 : null,
        next: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
    }
};

export const CreateFormattedDateOnly = (date?: string | Date | null) => {
    if (!date) return null;
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka', day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const CreateFormattedDateWithTime = (dateWithTime?: string | Date | null) => {
    if (!dateWithTime) return null;
    const parsed = new Date(dateWithTime);
    if (isNaN(parsed.getTime())) return null;

    return parsed
        .toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        })
        .replace(/\s+/g, ' ')
        .replace(', ', ' - ')
        .toUpperCase();
};

export const CreateSearchRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');