import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
