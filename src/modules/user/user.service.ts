import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService, PrismaService } from '@shared/services';
import { CreateUserDto, GetUserDto } from './dto';
import { QueuesKeyEnum } from '@shared/enums';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue(QueuesKeyEnum.USER)
    private readonly userQueue: Queue,
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

    await this.userQueue.add(QueuesKeyEnum.CREATED_USER, {
      id,
      email,
      name,
      createdAt,
      updatedAt,
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
