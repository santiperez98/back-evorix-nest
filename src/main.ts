import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ HABILITAR CORS (para permitir peticiones del frontend)
  app.enableCors({
    origin: [
      'http://localhost:3000',           // Frontend local
      'https://evorix.com.ar ',           // Tu dominio en producción ✅
      'https://www.evorix.com.ar ',       // Con www también
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 👉 Importante si usás cookies, sesiones o headers como Authorization
  });

  // 🚀 Usar el puerto que Render asigna (process.env.PORT) o 3001 como fallback
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Aplicación corriendo en el puerto ${port}`);
}

bootstrap();