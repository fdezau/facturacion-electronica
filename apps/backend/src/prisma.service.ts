import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL
        ?? 'postgresql://factuser:factpass123@localhost:5434/facturacion_db',
    })
    const adapter = new PrismaPg(pool)
    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
    console.log('🗄️  Base de datos conectada')
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
