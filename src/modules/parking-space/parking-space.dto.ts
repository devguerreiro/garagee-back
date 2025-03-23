import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ParkingSpaceDetailParamDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}
