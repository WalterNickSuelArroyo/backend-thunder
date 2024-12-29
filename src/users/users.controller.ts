import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { HasRoles } from 'src/auth/jwt/has-roles';
// import { HasRoles } from 'src/auth/jwt/has-roles';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get() // http://localhost/users -> GET
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @HasRoles(JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id') // http://192.168.1.15:3000/users/:id -> PUT
  update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }

  @HasRoles(JwtRole.CLIENT)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    return this.usersService.updateWithImage(file, id, user);
  }

  @HasRoles(JwtRole.CLIENT)
  @Put('notification_token/:id') // http://192.168.1.15:3000/users/:id -> PUT
  updateNotificationToken(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    return this.usersService.update(id, user);
  }

  // @HasRoles(JwtRole.CLIENT)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  // @Put('upload/:id')
  // @UseInterceptors(FileInterceptor('file'))
  // updateWithImage(
  //     @UploadedFile(
  //         new ParseFilePipe({
  //             validators: [
  //               new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
  //               new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  //             ],
  //           }),
  //     ) file: Express.Multer.File,
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() user: UpdateUserDto
  // ) {
  //     return this.usersService.updateWithImage(file, id, user);
  // }
}
