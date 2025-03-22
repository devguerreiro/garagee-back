import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ParkingSpaceDetailParamsDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}
