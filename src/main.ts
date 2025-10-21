import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Dodaj ovo

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Omogući CORS
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); 

  // Inicijalizacija Swaggera
  const config = new DocumentBuilder()
    .setTitle('Poll App API') 
    .setVersion('1.0') 
    .addBearerAuth( 
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(3000);
}
bootstrap();