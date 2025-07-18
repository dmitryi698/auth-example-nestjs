import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto.email, dto.password);
    return { id: user.id, email: user.email };
  }

  @ApiOperation({ summary: 'Получение списка всех пользователей' })
  @Get('getAll')
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.usersService.findAll();
  }
}
