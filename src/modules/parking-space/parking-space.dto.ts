import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
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
