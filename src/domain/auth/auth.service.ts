import { UserService } from '@domain/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialDTO, GetCredentialDTO } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@shared/modules';

@Injectable()
export class AuthService {
  private readonly USER_INVALID_MESSAGE = 'E-mail ou senha inválidos';

  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: CredentialDTO): Promise<GetCredentialDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new UnauthorizedException(this.USER_INVALID_MESSAGE);
    }

    const [userValidation] = user.userEmailValidation;

    if (!userValidation.validatedAt) {
      throw new UnauthorizedException(this.USER_INVALID_MESSAGE);
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
