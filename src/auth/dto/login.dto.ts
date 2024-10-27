import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  password: string;
}
