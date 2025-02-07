import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Nom d\'utilisateur' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Mot de passe' })
  @IsString()
  password: string;
}
