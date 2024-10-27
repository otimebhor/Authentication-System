import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsString()
  last_name: string;

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

  @ApiProperty({
    description: 'The phone number of the user',
    example: '090387373883',
  })
  @IsString()
  phone: string;
}
