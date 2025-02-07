import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nom d\'utilisateur' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Mot de passe', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
