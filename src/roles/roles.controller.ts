import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() rol: CreateRolDto) {
    return this.rolesService.create(rol);
  }
}