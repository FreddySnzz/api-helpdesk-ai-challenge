import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { 
      logger: [
        'log', 
        'warn', 
        'error', 
      ] 
    }
  );
  const appPort = process.env.PORT || 8080;

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
      'qh-user-id',
    ],
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const baseUrls = [
    {
      url: process.env.BASE_URL || `http://localhost:${appPort}`,
      description: 'Local server',
    },
    { 
      url: 'https://prod.example.com', 
      description: 'Production' 
    },
  ];

  await app.listen(appPort, async () => {
    const logger = new Logger();
    logger.log(`\n ############################## API HELPDESK ##############################`);
    logger.log(`Servidor iniciado em ${baseUrls[0].url}`);
    logger.log(`Port: ${appPort}`);
    logger.log(`\n ############################## API HELPDESK ##############################`);
  });
}
bootstrap();
