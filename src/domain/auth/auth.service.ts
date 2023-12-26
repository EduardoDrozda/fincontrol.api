import { UserService } from '@domain/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from '@shared/services';
import { CredentialDTO, GetCredentialDTO } from './dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: CredentialDTO): Promise<GetCredentialDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail or password is incorrect');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      user: { email: user.email },
      accessToken: {
        type: 'Bearer',
        token,
      },
    };
  }
}