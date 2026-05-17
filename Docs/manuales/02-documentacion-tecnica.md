# Documentación Técnica — StudyBoard

## Para Desarrolladores

Este documento explica la arquitectura completa de StudyBoard, módulo por módulo, y cómo realizar mejoras futuras.

---

## Índice

1. [Arquitectura General](#arquitectura-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Cómo Agregar Nuevos Módulos](#cómo-agregar-nuevos-módulos)
7. [Mejoras Futuras](#mejoras-futuras)
8. [Buenas Prácticas](#buenas-prácticas)

---

## Arquitectura General

StudyBoard sigue una arquitectura **cliente-servidor** separada:

```
┌─────────────────────────────────────────────────────┐
│                    NAVEGADOR                         │
│  ┌───────────────────────────────────────────────┐ │
│  │         Angular 19 (Frontend)                  │ │
│  │  - Componentes con Signals                    │ │
│  │  - PrimeNG para UI                            │ │
│  │  - HttpService para API calls                 │ │
│  └───────────────┬───────────────────────────────┘ │
└──────────────────┼──────────────────────────────────┘
                   │ HTTP/HTTPS
                   │ JSON
                   ↓
┌─────────────────────────────────────────────────────┐
│              NestJS (Backend API)                    │
│  ┌───────────────────────────────────────────────┐ │
│  │  Controllers (Endpoints REST)                 │ │
│  │         ↓                                      │ │
│  │  Services (Lógica de negocio)                 │ │
│  │         ↓                                      │ │
│  │  TypeORM Entities                             │ │
│  └───────────────┬───────────────────────────────┘ │
└──────────────────┼──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│            SQLite (Base de Datos)                    │
│         studyboard.sqlite                            │
└─────────────────────────────────────────────────────┘
```

### Flujo de una Petición

1. Usuario interactúa con componente Angular
2. Componente llama a `HttpService.get/post/patch/delete`
3. HttpService envía petición HTTP a NestJS
4. `JwtAuthGuard` valida el token JWT
5. Controller recibe la petición
6. Service ejecuta lógica de negocio
7. TypeORM consulta/modifica la base de datos
8. Service retorna datos
9. Controller formatea respuesta: `{ data, message, statusCode }`
10. HttpService recibe respuesta
11. Componente actualiza la UI con signals

---

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Angular** | 19 | Framework SPA con componentes standalone |
| **TypeScript** | 5.x | Tipado estático |
| **PrimeNG** | 19+ | Librería de componentes UI |
| **RxJS** | 7.x | Manejo de asincronía (observables) |
| **Signals** | Angular 19 | Estado reactivo |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 10.x | Framework backend con arquitectura modular |
| **TypeORM** | 0.3.x | ORM para manejo de base de datos |
| **SQLite** | 3.x | Base de datos embebida |
| **JWT** | - | Autenticación con tokens |
| **bcrypt** | - | Hash de contraseñas |
| **class-validator** | - | Validación de DTOs |
| **multer** | - | Subida de archivos |

---

## Estructura del Proyecto

```
studyboard/
├── backend/
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── materias/          # CRUD de materias
│   │   ├── tareas/            # CRUD de tareas
│   │   ├── semestres/         # CRUD de semestres
│   │   ├── horario/           # Gestión de horario
│   │   ├── temarios/          # Parciales e items
│   │   ├── calificaciones/    # Sistema de notas
│   │   ├── dashboard/         # Métricas agregadas
│   │   ├── alertas/           # Notificaciones de tareas
│   │   ├── documentos/        # Subida de archivos
│   │   ├── app.module.ts      # Módulo raíz
│   │   └── main.ts            # Punto de entrada
│   ├── uploads/               # Archivos subidos (no en git)
│   └── studyboard.sqlite      # Base de datos (no en git)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Guards, interceptors, config
│   │   │   ├── shared/        # Layout, componentes reutilizables
│   │   │   └── features/      # Módulos por funcionalidad
│   │   │       ├── auth/
│   │   │       ├── dashboard/
│   │   │       ├── materias/
│   │   │       ├── tablero/   # Kanban de tareas
│   │   │       ├── horario/
│   │   │       ├── temarios/
│   │   │       ├── calificaciones/
│   │   │       ├── alertas/
│   │   │       └── documentos/
│   │   └── environments/
│   └── angular.json
│
└── docs/
    ├── architecture/          # Diagramas y decisiones
    ├── api/                   # Documentación de endpoints
    └── manuales/              # Guías de usuario e instalación
```

---

## Módulos del Sistema

### M00: Setup & Infraestructura

**Responsabilidad:** Configuración inicial del proyecto.

**Archivos clave:**
- `backend/src/main.ts` — Configuración de CORS, validación global, archivos estáticos
- `frontend/src/environments/` — Variables de entorno
- `backend/.env` — Secretos JWT y configuración DB

**Decisiones técnicas:**
- SQLite para portabilidad (un solo archivo `.sqlite`)
- CORS habilitado para `localhost:4200` en desarrollo
- Validación global con `class-validator`

---

### M01: Auth (Autenticación)

**Responsabilidad:** Registro, login, refresh de tokens.

**Backend:**
- **Entidad:** `Usuario` (id, nombre, email, passwordHash)
- **DTOs:** `RegisterDto`, `LoginDto`
- **Service:** Hash con bcrypt, generación de JWT
- **Guard:** `JwtAuthGuard` protege todas las rutas salvo `/auth/*`

**Frontend:**
- **Componentes:** `LoginComponent`, `RegisterComponent`
- **Guard:** `authGuard` redirige a login si no hay token
- **Interceptor:** `authInterceptor` adjunta `Authorization: Bearer <token>`

**Flujo de autenticación:**
```
1. Usuario llena formulario de login
2. POST /api/auth/login { email, password }
3. Backend valida credenciales y genera tokens
4. Frontend guarda tokens en localStorage
5. Redirige a /dashboard
6. Cada petición lleva el token en headers
7. Si el token expira, usar refresh token
```

**Mejoras futuras:**
- Usar httpOnly cookies en lugar de localStorage (más seguro)
- Implementar OAuth con Google/GitHub
- Agregar verificación de email

---

### M02: Semestres

**Responsabilidad:** Organizar materias por periodos académicos.

**Backend:**
- **Entidad:** `Semestre` (nombre, fechaInicio, fechaFin, activo)
- **Lógica:** Solo un semestre puede estar activo a la vez

**Frontend:**
- **Componentes:** `SemestresList`, `SemestreForm`
- **Features:** CRUD completo, activar/desactivar

**Relaciones:**
```
Usuario 1---N Semestre 1---N Materia
```

---

### M03: Materias

**Responsabilidad:** Gestionar las asignaturas del semestre.

**Backend:**
- **Entidad:** `Materia` (nombre, color, créditos, docente, semestreId, usuarioId)
- **Validación:** Color en formato hexadecimal

**Frontend:**
- **Componentes:** `MateriasList`, `MateriaForm`
- **UI:** ColorPicker de PrimeNG, chips con color personalizado

**Patrón de diseño:** Cada materia tiene un color único para identificación visual en toda la app.

---

### M04: Tablero Kanban (Tareas)

**Responsabilidad:** Gestión de tareas con metodología Kanban.

**Backend:**
- **Entidad:** `Tarea` (titulo, descripcion, estado, prioridad, fechaEntrega, materiaId)
- **Estados:** `pendiente`, `en_progreso`, `completada`
- **Prioridades:** `baja`, `media`, `alta`

**Frontend:**
- **Componentes:** `TableroKanban`, `TareaCard`, `TareaForm`
- **Features:** Drag & drop, filtro por materia, búsqueda

**Lógica especial:**
- Al cambiar el estado de una tarea, se actualiza solo el campo `estado`
- El filtro por materia es reactivo con signals

---

### M05: Horario

**Responsabilidad:** Horario semanal de clases.

**Backend:**
- **Entidad:** `BloqueHorario` (dia, horaInicio, horaFin, aula, materiaId)
- **Enum:** `DiaSemana` (lunes-sábado)
- **Validación:** `horaInicio < horaFin`

**Frontend:**
- **Componente:** `HorarioGrid` — tabla con días y horas
- **Algoritmo:** Computed signals para organizar bloques en matriz

```typescript
// Ejemplo de organización
const bloquesPorDia = computed(() => {
  const map = new Map<DiaSemana, BloqueHorario[]>();
  bloques().forEach(b => {
    if (!map.has(b.dia)) map.set(b.dia, []);
    map.get(b.dia)!.push(b);
  });
  return map;
});
```

---

### M06: Temarios

**Responsabilidad:** Contenido temático por parciales.

**Backend:**
- **Entidades:** 
  - `Parcial` (numero, nombre, fechaExamen, materiaId)
  - `ItemTemario` (tema, subtemas[], orden, parcialId)
- **Cascada:** Al eliminar un parcial, se eliminan sus items

**Frontend:**
- **Componentes:** `TemarioList`, `ParcialForm`, `ItemTemarioList`
- **Features:** Reordenar items, expandir/colapsar parciales

**Patrón:** Relación uno-a-muchos con cascade delete.

---

### M07: Calificaciones

**Responsabilidad:** Registro de notas y cálculo de promedio ponderado.

**Backend:**
- **Entidades:**
  - `CriterioEvaluacion` (nombre, ponderacion, materiaId)
  - `Calificacion` (valor, parcialId, criterioId)
- **Lógica compleja:** 
  ```typescript
  // Promedio ponderado
  promedio = Σ(promedioCalifsPorCriterio × ponderaciónCriterio) / 100
  
  // Proyección (nota mínima necesaria)
  proyeccion = (notaDeseada × 100 - sumaActual) / ponderacionRestante
  ```

**Frontend:**
- **Componente:** `CalificacionesList` — tabla integrada con criterios
- **Features:** Validación de ponderaciones (suma ≤ 100%), proyección en tiempo real

**Decisión técnica:** Un criterio puede tener múltiples calificaciones (promedia entre ellas).

---

### M08: Dashboard

**Responsabilidad:** Métricas generales y vista de inicio.

**Backend:**
- **Service:** Agrega datos de múltiples módulos:
  - Cuenta materias, tareas por estado
  - Calcula promedio general (de todos los promedios de materias)
  - Cuenta tareas próximas (próximos 7 días)

**Frontend:**
- **Componente:** `DashboardComponent`
- **Secciones:**
  1. Tarjetas de métricas (4 cards)
  2. Accesos rápidos (6 botones con íconos)
  3. Próximas entregas (widget con tareas urgentes)
  4. Onboarding para nuevos usuarios

**Computed signals:**
```typescript
const promedioColor = computed(() => {
  const p = resumen().promedioGeneral;
  if (p >= 80) return 'success';
  if (p >= 60) return 'warning';
  return 'danger';
});
```

---

### M09: Alertas

**Responsabilidad:** Notificaciones de tareas próximas a vencer.

**Backend:**
- **Entidad:** `Alerta` (tareaId, usuarioId, leida, fechaCreacion)
- **Lógica:** Crea alertas automáticamente para tareas en próximas 48h
- **Endpoints:** GET todas, POST marcar leída, GET contar no leídas

**Frontend:**
- **Componente:** `LayoutComponent` — navbar con badge
- **Features:**
  - Polling cada 5 minutos
  - Badge con número de alertas no leídas
  - OverlayPanel con listado
  - Toast al entrar si hay alertas

**Patrón:** Sistema reactivo con computed signal para el conteo.

---

### M10: Documentos

**Responsabilidad:** Subida y gestión de archivos adjuntos.

**Backend:**
- **Entidad:** `Documento` (nombre, url, tipo, tamano, tipoReferencia, referenciaId)
- **Referencia polimórfica:** Puede adjuntarse a materias, tareas o parciales
- **Multer:** Maneja la subida de archivos
- **Archivos:** Se guardan en `/uploads` con nombre único

**Frontend:**
- **Componente reutilizable:** `FileUploaderComponent`
- **Integraciones:**
  - Temarios: documentos por parcial
  - Tareas: adjuntos al editar tarea
- **Features:** Vista previa, descarga, eliminación

**Seguridad:**
- Solo el dueño puede ver/descargar sus documentos
- Validación de tipos MIME (opcional, se puede agregar)
- Límite de tamaño configurable (10MB por defecto)

---

## Patrones de Diseño

### 1. Arquitectura por Capas (Backend)

```
Controller → Service → Repository (TypeORM) → Database
```

- **Controller:** Maneja HTTP, validación de entrada
- **Service:** Lógica de negocio
- **Repository:** Acceso a datos

### 2. Standalone Components (Frontend)

```typescript
@Component({
  selector: 'app-ejemplo',
  imports: [CommonModule, ButtonModule], // No NgModule
  template: `...`,
})
export class EjemploComponent {}
```

### 3. Signals para Estado Reactivo

```typescript
const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(5); // doubled ahora es 10
```

### 4. Centralización de Endpoints

```typescript
// API_ENDPOINTS en lugar de URLs dispersas
export const API_ENDPOINTS = {
  materias: {
    getAll: '/api/materias',
    getById: (id) => `/api/materias/${id}`,
  },
};
```

### 5. DTOs para Validación

```typescript
export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i)
  color: string;
}
```

### 6. Guards para Autorización

```typescript
@Controller('api/materias')
@UseGuards(JwtAuthGuard) // Todas las rutas protegidas
export class MateriasController {}
```

---

## Cómo Agregar Nuevos Módulos

### Paso 1: Backend

1. **Crear carpeta del módulo:**
   ```bash
   cd backend/src
   mkdir mi-modulo
   ```

2. **Crear entidad:**
   ```typescript
   // mi-modulo.entity.ts
   @Entity('mi_tabla')
   export class MiModulo {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column()
     nombre: string;
     
     @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
     usuario: Usuario;
     
     @Column({ name: 'usuario_id' })
     usuarioId: string;
   }
   ```

3. **Crear DTOs:**
   ```typescript
   // dto/create-mi-modulo.dto.ts
   export class CreateMiModuloDto {
     @IsString()
     @IsNotEmpty()
     nombre: string;
   }
   ```

4. **Crear servicio:**
   ```typescript
   @Injectable()
   export class MiModuloService {
     constructor(
       @InjectRepository(MiModulo)
       private repo: Repository<MiModulo>,
     ) {}
     
     async findAll(usuarioId: string) {
       return this.repo.find({ where: { usuarioId } });
     }
   }
   ```

5. **Crear controlador:**
   ```typescript
   @Controller('api/mi-modulo')
   @UseGuards(JwtAuthGuard)
   export class MiModuloController {
     constructor(private service: MiModuloService) {}
     
     @Get()
     async findAll(@Request() req) {
       const data = await this.service.findAll(req.user.id);
       return { data, message: 'OK', statusCode: 200 };
     }
   }
   ```

6. **Crear módulo:**
   ```typescript
   @Module({
     imports: [TypeOrmModule.forFeature([MiModulo])],
     controllers: [MiModuloController],
     providers: [MiModuloService],
   })
   export class MiModuloModule {}
   ```

7. **Registrar en AppModule:**
   ```typescript
   @Module({
     imports: [
       // ...
       MiModuloModule,
     ],
   })
   export class AppModule {}
   ```

### Paso 2: Frontend

1. **Crear estructura de carpetas:**
   ```
   frontend/src/app/features/mi-modulo/
   ├── mi-modulo-list/
   │   ├── mi-modulo-list.component.ts
   │   ├── mi-modulo-list.component.html
   │   └── mi-modulo-list.component.scss
   ├── mi-modulo-form/
   │   └── ...
   ├── mi-modulo.model.ts
   └── mi-modulo.routes.ts
   ```

2. **Crear modelo:**
   ```typescript
   export interface MiModulo {
     id: string;
     nombre: string;
   }
   
   export interface MiModuloResponse {
     data: MiModulo[];
     message: string;
     statusCode: number;
   }
   ```

3. **Agregar endpoints:**
   ```typescript
   // api.endpoints.ts
   miModulo: {
     getAll: '/api/mi-modulo',
     create: '/api/mi-modulo',
     // ...
   },
   ```

4. **Crear componente:**
   ```typescript
   @Component({
     selector: 'app-mi-modulo-list',
     imports: [CommonModule, TableModule, ButtonModule],
     template: `
       <p-table [value]="items()">
         <!-- ... -->
       </p-table>
     `,
   })
   export class MiModuloListComponent {
     private http = inject(HttpService);
     readonly items = signal<MiModulo[]>([]);
     
     ngOnInit() {
       this.cargar();
     }
     
     async cargar() {
       const res = await this.http.get<MiModuloResponse>(
         API_ENDPOINTS.miModulo.getAll
       );
       this.items.set(res.data);
     }
   }
   ```

5. **Crear rutas:**
   ```typescript
   export const miModuloRoutes: Routes = [
     {
       path: '',
       loadComponent: () => import('./mi-modulo-list/...')
         .then(m => m.MiModuloListComponent),
     },
   ];
   ```

6. **Registrar en app.routes.ts:**
   ```typescript
   {
     path: 'mi-modulo',
     loadChildren: () => import('./features/mi-modulo/mi-modulo.routes')
       .then(m => m.miModuloRoutes),
   },
   ```

7. **Agregar al navbar (layout.component.ts):**
   ```typescript
   menuItems: [
     // ...
     {
       label: 'Mi Módulo',
       icon: 'pi pi-star',
       routerLink: ['/mi-modulo'],
     },
   ],
   ```

---

## Mejoras Futuras

### 1. Integración con Google Calendar

**Complejidad:** ⚡ Alta  
**Propósito:** Sincronizar horario y fechas de entrega con Google Calendar.

**Implementación:**
1. Configurar OAuth 2.0 en Google Cloud Console
2. Backend: Agregar `@nestjs/passport-google-oauth20`
3. Frontend: Botón "Conectar con Google"
4. Sincronización bidireccional:
   - Exportar tareas → eventos de Calendar
   - Importar eventos → tareas de StudyBoard

**Archivos a crear:**
- `backend/src/google-calendar/google-calendar.service.ts`
- `frontend/src/app/features/integraciones/google-calendar/`

---

### 2. Export de Horario a PDF

**Complejidad:** 🔶 Media  
**Propósito:** Descargar el horario en formato PDF.

**Implementación:**
1. Backend: Usar `pdfkit` o `puppeteer`
2. Endpoint: `GET /api/horario/export-pdf`
3. Frontend: Botón de descarga

**Ejemplo (backend):**
```typescript
@Get('export-pdf')
async exportPdf(@Request() req, @Res() res) {
  const bloques = await this.service.findAll(req.user.id);
  const pdf = await this.pdfService.generarHorario(bloques);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdf);
}
```

---

### 3. Notificaciones Push (PWA)

**Complejidad:** ⚡ Alta  
**Propósito:** Notificar al usuario aunque no tenga la app abierta.

**Implementación:**
1. Convertir a PWA (agregar `manifest.json` y service worker)
2. Backend: Usar Firebase Cloud Messaging o web-push
3. Frontend: Pedir permiso de notificaciones
4. Enviar notificaciones cuando una tarea está por vencer

**Archivos a crear:**
- `frontend/src/manifest.webmanifest`
- `frontend/src/service-worker.js`
- `backend/src/notifications/notifications.service.ts`

---

### 4. Dark Mode

**Complejidad:** 🔶 Media  
**Propósito:** Tema oscuro para reducir fatiga visual.

**Implementación:**
1. Definir variables CSS para ambos temas
2. Agregar toggle en navbar
3. Guardar preferencia en localStorage

**Ejemplo (CSS):**
```scss
:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #e0e0e0;
}
```

---

### 5. Proyección de Calificación Avanzada

**Complejidad:** ⚡ Alta  
**Propósito:** Simular escenarios de calificaciones futuras.

**Implementación:**
1. Permitir al usuario agregar "calificaciones hipotéticas"
2. Calcular múltiples escenarios (optimista, realista, pesimista)
3. Mostrar gráfica con proyecciones

**UI:**
- Slider para ajustar calificaciones futuras
- Gráfica de línea con escenarios

---

### 6. Modo Colaborativo

**Complejidad:** ⚡ Alta  
**Propósito:** Compartir materias y tareas con compañeros.

**Implementación:**
1. Nueva entidad: `Compartido` (materiaId, usuarioInvitadoId, permisos)
2. Permisos: `lectura`, `escritura`, `admin`
3. WebSockets para sincronización en tiempo real (opcional)
4. UI: Modal de "Compartir materia" con búsqueda de usuarios

**Decisiones técnicas:**
- Separar datos propios vs compartidos
- Validar permisos en cada operación
- Notificar cambios a colaboradores

---

## Buenas Prácticas

### Backend

1. **Siempre validar datos de entrada** con DTOs y `class-validator`
2. **Usar guards para autenticación**, no validar manualmente
3. **Estructurar respuestas consistentemente:** `{ data, message, statusCode }`
4. **No exponer errores internos** al cliente, loguearlos
5. **Usar transacciones** para operaciones que afectan múltiples tablas
6. **Indexar columnas** que se usan frecuentemente en WHERE

### Frontend

1. **Un componente = una responsabilidad** (list, form, card)
2. **Usar signals** en lugar de observables para estado simple
3. **Centralizar endpoints** en `api.endpoints.ts`
4. **No duplicar lógica HTTP**, usar el `HttpService` genérico
5. **Validar formularios** antes de enviar al backend
6. **Lazy-load rutas** para mejorar tiempos de carga

### General

1. **Commits atómicos:** Un módulo = un commit
2. **Conventional Commits:** `feat:`, `fix:`, `docs:`
3. **No commitear secretos** (`.env`, tokens)
4. **Documentar decisiones no obvias** en comentarios
5. **Tests unitarios** para lógica compleja (proyección, promedio)

---

## Troubleshooting

### Error: "Cannot find module '@nestjs/...'"
**Solución:** `npm install` en backend/

### Error: "NG0303: Can't bind to 'ngModel'"
**Solución:** Importar `FormsModule` en el componente

### Error: "401 Unauthorized"
**Solución:** Token expirado, refrescar con `/auth/refresh`

### Error: "CORS policy"
**Solución:** Verificar que `origin` en `main.ts` coincida con el frontend

### Base de datos corrupta
**Solución:** Eliminar `studyboard.sqlite` y reiniciar backend (TypeORM recreará tablas)

---

## Contacto y Contribuciones

**Repositorio:** [github.com/Vicman3x3/studyboard](https://github.com/Vicman3x3/studyboard)  
**Issues:** Para reportar bugs o proponer features  
**Pull Requests:** Bienvenidos, seguir las convenciones del proyecto

---

**Autor:** Taller "Akuma no Code"  
**Versión:** 1.0  
**Última actualización:** Mayo 2026
