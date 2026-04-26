import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.18.78:3000'],
    credentials: true,
  })

  app.setGlobalPrefix('api')

  const port = process.env.PORT ?? 3001
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 Backend corriendo en http://localhost:${port}/api`)
}
bootstrap()
