import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export class Application {
  private configService: ConfigService;
  private server: INestApplication;

  async startup() {
    await this.configApplication();
    await this.configScopes();

    const port = this.configService.get('APP_PORT');
    await this.server.listen(port, () => {
      Logger.log(`Server listening on port ${port}`);
    });
  }

  private async configApplication() {
    this.server = await NestFactory.create(AppModule);
    this.configService = this.server.get(ConfigService);
  }

  private async configScopes() {
    this.server.setGlobalPrefix('api');
    this.server.useGlobalPipes(new ValidationPipe());
  }
}
