import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

const statuses = ['approved', 'pending', 'refused'] as const;

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
