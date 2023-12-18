import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@shared/services';
import { HashService } from '@shared/services/hash/hash.service';

@Module({
  providers: [PrismaService, HashService],
  exports: [PrismaService, HashService],
})
@Global()
export class GlobalModule {}
