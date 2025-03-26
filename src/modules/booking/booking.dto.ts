import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

const statuses = ['approved', 'pending', 'refused'] as const;

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
  @IsIn(statuses)
  status?: (typeof statuses)[number];
}

export class BookingDetailParamDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}
