import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  // Resolve o problema de serialização do BigInt
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const port = process.env.API_PORT ?? 3000;
  await app.listen(port);

  console.log(`Aplicação rodando em: http://localhost:${port}/api`);
}

bootstrap();