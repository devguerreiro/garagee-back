import { BookingStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ParkingSpacesQueryDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === undefined ? undefined : value === 'true',
  )
  isCovered?: boolean;
}

export class ParkingSpaceDetailParamDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}

export class ParkingSpaceDetailQueryDTO {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  timezoneOffset: number;
}

export class ParkingSpaceBookingsQueryDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value as string).toUpperCase())
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
