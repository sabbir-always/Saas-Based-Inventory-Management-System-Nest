import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isObjectIdOrHexString } from 'mongoose';

@Injectable()
export class MongooseObjectIdPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        if (!isObjectIdOrHexString(value)) throw new BadRequestException('Invalid ID');
        return value;
    }
}