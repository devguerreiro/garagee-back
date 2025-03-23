import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BookingDetailParamDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  publicId: string;
}
