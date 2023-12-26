import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialDTO } from './dtos';
import { IsPublic } from '@shared/decorators';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  async login(@Body() credential: CredentialDTO) {
    return this.authService.login(credential);
  }
}
