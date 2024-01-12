import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto, GetUserDto, UserValidateDTO } from './dto';
import { QueuesKeyEnum } from '@shared/enums';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Prisma } from '@prisma/client';
import { HashService, PrismaService } from '@shared/modules';
import { UserEmailValidation, UserWithUserEmailValidation } from './models';

@Injectable()
export class UserService {
  private readonly USER_EMAIL_ALREADY_EXISTS_ERROR = 'Email already exists';
  private readonly USER_EMAIL_VALIDATION_ERROR = 'Invalid token';
  private readonly USER_EMAIL_ALREADY_VALIDATED_ERROR =
    'User already validated';
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
      throw new BadRequestException(this.USER_EMAIL_ALREADY_EXISTS_ERROR);
    }
  }

  async findByEmail(
    email: string,
  ): Promise<UserWithUserEmailValidation | null> {
    return await this.prismaservice.user.findUnique({
      where: { email },
      include: {
        userEmailValidation: true,
      },
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

  async validateUser({ token }: UserValidateDTO): Promise<void> {
    const userEmailValidation =
      await this.prismaservice.userEmailValidation.findFirst({
        where: { token },
        include: {
          user: true,
        },
      });

    this.verifyUserEmailValidation(userEmailValidation);

    await this.validateUserEmail(userEmailValidation);
  }

  private verifyUserEmailValidation(userEmailValidation: UserEmailValidation) {
    if (!userEmailValidation) {
      throw new BadRequestException(this.USER_EMAIL_VALIDATION_ERROR);
    }

    if (userEmailValidation.validatedAt) {
      throw new BadRequestException(this.USER_EMAIL_ALREADY_VALIDATED_ERROR);
    }
  }

  private async validateUserEmail(userEmailValidation: UserEmailValidation) {
    await this.prismaservice.userEmailValidation.update({
      where: { id: userEmailValidation.id },
      data: { validatedAt: new Date() },
    });
  }
}
