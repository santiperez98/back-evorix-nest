import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ HABILITAR CORS
  app.enableCors({
    origin: 'http://localhost:3000', // 🧠 Cambiá esto si tu front usa otro puerto o está en producción
    credentials: true, // 🔐 Necesario si usás cookies o Authorization headers
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
