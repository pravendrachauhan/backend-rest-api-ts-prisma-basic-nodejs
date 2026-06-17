import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserFilteringDto } from './dto/get-user-filering.dto';
import { ApiQuery, ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../../common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { diskStorage } from 'multer';

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
  //@UseGuards(JwtAuthGuard, RolesGuard) // Apply the JWT authentication guard and the custom RolesGuard to this route
  @Role(Roles.ADMIN) // Specify that only users with the 'admin' role can access this route
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
  //@UseGuards(JwtAuthGuard, RolesGuard) // Apply the JWT authentication guard and the custom RolesGuard to this route
  @Role(Roles.ADMIN) // Specify that only users with the 'admin' role can access this route
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id);
  }

  @UseInterceptors(
    FileInterceptor('file', {
        storage:
          diskStorage({
            destination:
              './uploads',
          
            filename: (req, file, cb) => {
              const uniqueSuffix =
                Date.now() +
                '-' +
                Math.round(
                  Math.random() * 1e9,
                );
              const ext =
                file.originalname.split('.').pop();
              cb(
                null,
                `${file.fieldname}-${uniqueSuffix}.${ext}`,
              );
            },
            fileFilter:
            (
              req,
              file,
              callback,
            ) => {

              if (
                !file.mimetype.startsWith(
                  'image/',
                )
              ) {
                return callback(
                  new BadRequestException(
                    'Only images allowed',
                  ),
                  false,
                );
              }

              callback(
                null,
                true,
              );
            },
            limits: {
              fileSize:
                5 * 1024 * 1024,
            },
          }),
      })
    )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' }, // ⚠️ Required to render file picker
      },
    },
  })
  @Post(':id/avatar')
  async uploadAvatar(@Param('id') id: number, @UploadedFile() file: Multer.File) {
    const updatedUser = await this.usersService.uploadAvatar(id, file);
    return updatedUser;
  }

}

//@UseGuards(JwtAuthGuard, RolesGuard) 
// instead of using @UseGuards(JwtAuthGuard, RolesGuard) on each route, you can apply it at the controller level to protect all routes in the UsersController.
// adding auth guard in JwtAuthGuard class , will check if public() then no auth needed else JWT auth needed. So we can remove @UseGuards(JwtAuthGuard) from each route and add it at the controller level.

