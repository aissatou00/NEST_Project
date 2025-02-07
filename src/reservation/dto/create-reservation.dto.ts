import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({ example: 634649, description: "ID du film à réserver" })
  @Transform(({ value }) => parseInt(value, 10)) 
  @IsInt({ message: "L'ID du film doit être un nombre entier" })
  @IsNotEmpty({ message: "L'ID du film est requis" })
  movieId: number;

  @ApiProperty({ example: "2025-02-05T16:00:00Z", description: "Date et heure de la réservation (ISO 8601)" })
  @IsNotEmpty({ message: "La date de réservation est requise" })
  @IsDateString({}, { message: "Format de date invalide (ISO 8601 requis)" })
  startTime: string;
}
