import { Controller, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserValidateDTO } from './dto';
import { IsPublic } from '@shared/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('/validate')
  @IsPublic()
  validateUser(@Body() data: UserValidateDTO) {
    return this.userService.validateUser(data);
  }
}
