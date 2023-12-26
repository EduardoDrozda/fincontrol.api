import { BadRequestException, Injectable } from '@nestjs/common';
import { HashService, PrismaService } from '@shared/services';
import { CreateUserDto, GetUserDto } from './dto';
import { QueuesKeyEnum } from '@shared/enums';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue(QueuesKeyEnum.USER)
    private readonly userQueue: Queue,
    private readonly prismaservice: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async create({ email, name, password }: CreateUserDto): Promise<GetUserDto> {
    await this.verifyIfUserEmailAlreadyExists(email);

    const { id, createdAt, updatedAt } = await this.createUser({
      email,
      name,
      password: await this.hashService.hash(password),
    });

    await this.queueUserCreatedEvent({
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

  private async verifyIfUserEmailAlreadyExists(email: string): Promise<void> {
    const findeduser = await this.findByEmail(email);

    if (findeduser) {
      throw new BadRequestException('Email already exists');
    }
  }

  async findByEmail(email: string) {
    return await this.prismaservice.user.findUnique({
      where: { email },
    });
  }

  private async createUser(data: Prisma.UserCreateInput): Promise<GetUserDto> {
    return this.prismaservice
      .$transaction(async (prisma) => {
        const user = await prisma.user.create({ data });

        await prisma.userEmailValidation.create({
          data: {
            userId: user.id,
            token: await this.hashService.hash(
              Math.floor(100000 + Math.random() * 900000).toString(),
            ),
          },
        });

        return user;
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  private async queueUserCreatedEvent(data: GetUserDto): Promise<void> {
    await this.userQueue.add(QueuesKeyEnum.CREATED_USER, data);
  }
}
