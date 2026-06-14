import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserFilteringDto } from './dto/get-user-filering.dto';
import { ApiQuery, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService){}

  // @Get()
  // getAllUsers(){
  //   return this.usersService.getUsers();
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Query() query: GetUserFilteringDto){
    return this.usersService.getUsers(query);
  }

  // @Get('filter')
  // @ApiQuery({ name: 'query', required: false, type: GetUserFilteringDto})
  // getUserAfterFiltering(@Query() query: GetUserFilteringDto){
  //   return this.usersService.getUsersAfterFiltering(query);
  // }

  @Get(':id')
  getUser(@Param('id') id: number){
    return this.usersService.getUser(id);
  }

  @Post() 
  CreateUser(@Body() user: CreateUserDto){
    return this.usersService.createUser(user);
  }

  @Put()
  updateUser(@Body() updatedUser: UpdateUserDto){
    return this.usersService.updateUser(updatedUser);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id);
  }
}
