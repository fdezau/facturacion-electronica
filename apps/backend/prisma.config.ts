import { defineConfig } from 'prisma/config'

const DATABASE_URL = 'postgresql://factuser:factpass123@localhost:5434/facturacion_db'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: DATABASE_URL,
  },
})
