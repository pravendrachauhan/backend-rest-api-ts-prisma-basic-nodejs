import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilteringDto } from './dto/get-user-filering.dto';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}
  
//   user = [
//   { "id": 1, "name": "Praveen" },
//   { "id": 2, "name": "John" },
//   { "id": 3, "name": "Praveen" },
//   { "id": 4, "name": "John" },
//   { "id": 5, "name": "Praveen" },
//   { "id": 6, "name": "John" },
//   { "id": 7, "name": "Praveen" },
//   { "id": 8, "name": "John" },
//   { "id": 9, "name": "Praveen" },
//   { "id": 10, "name": "John" },
//   { "id": 11, "name": "Praveen" },
//   { "id": 12, "name": "John" },
//   { "id": 13, "name": "Praveen" },
//   { "id": 14, "name": "John" },
//   { "id": 15, "name": "Praveen" },
//   { "id": 16, "name": "John" },
//   { "id": 17, "name": "Praveen" },
//   { "id": 18, "name": "John" },
//   { "id": 19, "name": "Praveen" },
//   { "id": 20, "name": "John" },
//   { "id": 21, "name": "Praveen" },
//   { "id": 22, "name": "John" },
//   { "id": 23, "name": "Praveen" },
//   { "id": 24, "name": "John" },
//   { "id": 25, "name": "Praveen" }
// ];

    deleteUser(id: string) {
      this.prisma.user_Data.delete({
        where: {
          id: Number(id),
        },
      });
      return "User deleted successfully";
    }

   async updateUser(updatedUser: any) {
      const user_Data = this.prisma.user_Data.update({
        where: {
          id: Number(updatedUser.id),
        },
        data: {
          name: updatedUser.name,
        },
      });

    return user_Data;
  }

    async createUser(createUserDto: CreateUserDto) {
      //this.user.push(user);
      //this.prisma.user.create({ data: user });  //but this will not validate the data, we need to use DTO for that
      return this.prisma.user_Data.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
        },
      });
      //return "User created successfully";
    }

    async getUser(id: number) {
      const user = await this.prisma.user_Data.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

   async getUsers(query: GetUserFilteringDto) {
        //return this.prisma.user_Data.findMany();
        query.page = query.page ?? 1;
        query.limit = query.limit ?? 10;
        query.sortBy = query.sortBy ?? 'asc'; 

        const user_Data = await this.prisma.user_Data.findMany({
          where: {name: query.name ? { contains: query.name, mode: 'insensitive' } : undefined},
          skip: (query.page - 1) * query.limit,
          take: query.limit,
          orderBy: {
            name: query.sortBy === 'desc' ? 'desc' : 'asc',
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },  
        );

        const total = await this.prisma.user_Data.count({});
        
        return {
          data: user_Data,
          total,
          page: query.page,
          limit: query.limit,
        };
    }

  //   getUsersAfterFiltering(query: any) {
  //     const page = query.page ?? 1;
  //     const limit = query.limit ?? 10;
  //     const start = (page - 1) * limit;
  //     const end = start + limit;  
  //     return this.user.slice(start, end);
  // }

} 


