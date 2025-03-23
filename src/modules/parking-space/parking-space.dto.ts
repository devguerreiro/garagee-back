import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ParkingSpacesQueryDTO {
  @IsOptional()
  @IsBooleanString()
  isCovered?: 'true' | 'false';
}

export class ParkingSpaceDetailParamDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}
