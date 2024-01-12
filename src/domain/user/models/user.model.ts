import { Prisma } from '@prisma/client';

const userWithUserEmailValidation = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { userEmailValidation: true },
});

export type UserWithUserEmailValidation = Prisma.UserGetPayload<
  typeof userWithUserEmailValidation
>;
