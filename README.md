# Sistema de Facturacion Electronica SUNAT

Sistema de facturacion electronica compatible con SUNAT Peru.
Genera facturas, boletas y notas de credito en PDF y XML UBL 2.1.

---

## Caracteristicas

- Autenticacion JWT con roles Admin y Operador
- Gestion de empresa emisora con datos SUNAT
- Clientes con validacion RUC/DNI via apis.net.pe
- Catalogo de productos con control de IGV
- Emision de comprobantes: Facturas, Boletas, Notas de Credito
- Generacion PDF con @react-pdf/renderer
- Generacion XML UBL 2.1 compatible con SUNAT
- Dashboard con KPIs y graficos de ventas
- Historial con filtros y descarga PDF/XML
- Cache con Redis
- Docker Compose para desarrollo local

---

## Stack Tecnologico

### Backend
| Tecnologia | Uso |
|---|---|
| NestJS 11 | Framework API REST |
| Prisma 7 | ORM + Migraciones |
| PostgreSQL 16 | Base de datos |
| Redis 7 | Cache |
| JWT + Passport | Autenticacion |
| @react-pdf/renderer | Generacion PDF |
| xmlbuilder2 | XML UBL 2.1 |
| axios | Consultas RUC/DNI |

### Frontend
| Tecnologia | Uso |
|---|---|
| Next.js 16 | Framework React App Router |
| Tailwind CSS v4 | Estilos |
| shadcn/ui | Componentes UI |
| TanStack Query | Cache y fetching |
| Zustand | Estado global |
| React Hook Form + Zod | Formularios y validacion |
| Recharts | Graficos |
| Lucide React | Iconos |

---

## Instalacion

### 1. Clonar
    git clone https://github.com/fdezau/facturacion-electronica.git
    cd facturacion-electronica

### 2. Docker
    docker compose up -d

### 3. Backend
    cd apps/backend
    pnpm install
    DATABASE_URL=postgresql://factuser:factpass123@localhost:5434/facturacion_db npx prisma migrate dev
    DATABASE_URL=postgresql://factuser:factpass123@localhost:5434/facturacion_db pnpm run start

### 4. Frontend
    cd apps/frontend
    pnpm install
    pnpm dev

### 5. Credenciales demo
    Email:    admin@fdev.pe
    Password: admin123

---

## API Endpoints

### Auth
| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /api/auth/login | Iniciar sesion |
| POST | /api/auth/register | Registrar usuario |
| GET | /api/auth/perfil | Perfil usuario |

### Comprobantes
| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /api/comprobantes | Emitir comprobante |
| GET | /api/comprobantes | Listar |
| GET | /api/comprobantes/:id | Detalle |
| GET | /api/comprobantes/:id/pdf | Descargar PDF |
| GET | /api/comprobantes/:id/xml | Descargar XML UBL 2.1 |
| PATCH | /api/comprobantes/:id/anular | Anular |

### Clientes
| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | /api/clientes | Listar clientes |
| POST | /api/clientes | Crear cliente |
| GET | /api/clientes/autocompletar | Validar RUC/DNI |
| DELETE | /api/clientes/:id | Eliminar cliente |

### Productos
| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | /api/productos | Listar productos |
| POST | /api/productos | Crear producto |
| DELETE | /api/productos/:id | Eliminar producto |

### Dashboard
| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | /api/dashboard/kpis | KPIs principales |
| GET | /api/dashboard/ventas-por-mes | Ventas 6 meses |

---

## Tipos de Comprobantes

| Tipo | Serie | Receptor |
|---|---|---|
| Factura | F001-XXXXXXXX | RUC |
| Boleta | B001-XXXXXXXX | DNI o RUC |
| Nota de Credito | FC01-XXXXXXXX | Referencia F/B |

---

## Flujo de Emision

1. Configurar empresa emisora (RUC, razon social, direccion)
2. Registrar cliente con validacion RUC/DNI automatica
3. Agregar productos al catalogo con precios e IGV
4. Emitir comprobante seleccionando cliente y productos
5. Sistema calcula IGV 18% automaticamente
6. Descargar PDF o XML UBL 2.1

---

## Autor

Francisco Deza - FDev Solutions
Desarrollador Full Stack | Lima, Peru
https://fdev-landing.pages.dev

---

## Licencia

MIT License - Libre para uso educativo y comercial.