import { BookingStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookingDTO {
  @IsNotEmpty()
  @IsUUID()
  parking_space: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  booked_from: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  booked_to: Date;
}

export class BookingsQueryDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string).toUpperCase())
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export class BookingDetailParamDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}
