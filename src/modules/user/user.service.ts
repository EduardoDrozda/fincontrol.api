import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService, PrismaService } from '@shared/services';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async create({ email, name, password }: CreateUserDto): Promise<GetUserDto> {
    const findeduser = await this.prismaservice.user.findUnique({
      where: { email },
    });

    if (findeduser) {
      throw new BadRequestException('Email already exists');
    }

    const { id, createdAt, updatedAt } = await this.prismaservice.user.create({
      data: {
        email,
        name,
        password: await this.hashService.hash(password),
      },
    });

    return {
      id,
      email,
      name,
      createdAt,
      updatedAt,
    };
  }

  findAll() {
    return `This action returns all user`;
  }
}
