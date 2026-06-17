import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import {
  Request,
  Response,
} from 'express';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Type guard for Prisma errors
    if (
      exception &&
      typeof exception === 'object' &&
      'code' in exception &&
      'meta' in exception
    ) {
      const prismaError = exception as { code: string; meta?: Record<string, unknown> };
      
      if (prismaError.code === 'P2002') {
        return response.status(409).json({
          success: false,
          statusCode: 409,
          message: 'Resource already exists',
        });
      }
    }

    throw exception;
  }
}