import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 🔥 Activa validación y transformación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  )

  // 🌐 CORS para frontend (Next.js / React)
  app.enableCors({
    origin: true,
    credentials: true,
  })

  const PORT = process.env.PORT || 3001
  await app.listen(PORT)

  console.log(`🚀 Server running on http://localhost:${PORT}`)
}

bootstrap()