import { IsNotEmpty, IsString } from 'class-validator';

export class UserValidateDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
