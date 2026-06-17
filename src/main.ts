import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 1. Import modules
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Build the Swagger configuration object
  const config = new DocumentBuilder()
    .setTitle('Startup API')
    .setDescription('The core API documentation for our startup platform')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  // 3. Generate the document factory
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // 4. Setup the endpoint path ('api') and mount it
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );

  app.useGlobalInterceptors( new LoggingInterceptor(), new ResponseInterceptor() );
  
  app.useGlobalFilters(
  new HttpExceptionFilter(),
);
  
 const configService = app.get(ConfigService);
 const port = configService.get<number>('PORT') || 3000;
 await app.listen(port);
}
bootstrap();