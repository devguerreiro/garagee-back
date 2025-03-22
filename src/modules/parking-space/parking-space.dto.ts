import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ParkingSpaceDetailParamsDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}

export class ParkingSpaceUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  @MaxLength(100)
  guidance: string;

  @IsNotEmpty()
  @IsBoolean()
  is_covered: boolean;
}
