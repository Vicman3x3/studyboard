# StudyBoard — CLAUDE.md

Gestor académico personal para estudiantes universitarios. Permite organizar materias, tareas con tablero Kanban, horario semanal, calificaciones con promedio automático, apuntes por materia y dashboard de avance. Proyecto de taller que demuestra desarrollo con IA usando documentación correcta; cualquier estudiante puede clonarlo y correrlo sin configuración adicional.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 19 |
| UI | PrimeNG 18+ |
| Backend | NestJS |
| ORM | TypeORM |
| Base de datos | SQLite (archivo local, sin servidor) |
| Auth | JWT (access token + refresh token) |
| Lenguaje | TypeScript en ambos extremos |

## Estructura del repositorio

```
studyboard/
├── CLAUDE.md
├── .gitignore
├── taller.code-workspace      # VS Code multi-root workspace
├── docs/                      # Documentación del proyecto
│   ├── architecture/          # Diagramas y decisiones de diseño
│   ├── api/                   # Especificación de endpoints
│   └── setup/                 # Guías de instalación y contribución
├── frontend/                  # Aplicación Angular 19
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Guards, interceptors, servicios singleton
│   │   │   ├── features/      # Módulos por funcionalidad (ver abajo)
│   │   │   └── shared/        # Componentes y pipes reutilizables
│   │   ├── environments/
│   │   └── assets/
│   ├── angular.json
│   └── package.json
└── backend/                   # API NestJS
    ├── src/
    │   ├── auth/              # Módulo JWT
    │   ├── materias/
    │   ├── tareas/
    │   ├── horario/
    │   ├── calificaciones/
    │   ├── apuntes/
    │   └── dashboard/
    ├── database/              # Migraciones TypeORM
    └── package.json
```

## Funcionalidades principales

- **Materias** — CRUD de materias con color, créditos y docente
- **Tareas (Kanban)** — tablero con columnas: `pendiente | en_progreso | completada`; filtro por materia
- **Horario** — vista semanal (Lun–Vie) con bloques horarios por materia
- **Calificaciones** — registro de parciales/finales con cálculo automático de promedio ponderado
- **Apuntes** — notas por materia con soporte Markdown
- **Dashboard** — métricas de avance: tareas completadas, promedio general, materias activas

## Comandos de desarrollo

```bash
# Frontend
cd frontend
npm install
npm run start          # http://localhost:4200

# Backend
cd backend
npm install
npm run start:dev      # http://localhost:3000

# Ambos a la vez (desde raíz, si se configura script raíz)
npm run dev
```

## Variables de entorno

**`backend/.env`** (no versionado):
```
JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_PATH=./studyboard.sqlite
PORT=3000
```

**`frontend/.env`** (no versionado):
```
API_URL=http://localhost:3000
```

## Convenciones de código

### General
- TypeScript estricto (`strict: true`) en ambos proyectos
- Nombres en **inglés** para código (variables, clases, métodos, rutas de API)
- Texto visible al usuario en **español** (labels, mensajes, validaciones)
- Sin comentarios obvios; comentar solo el *por qué* cuando no es evidente

### Frontend (Angular)
- Componentes standalone (Angular 19, sin NgModules salvo en features)
- Signals para estado local; NgRx solo si el estado es global y complejo
- Un servicio por feature; inyección con `inject()` en lugar de constructor DI
- Rutas lazy-loaded por feature
- PrimeNG para todos los componentes de UI; no mezclar con otras librerías
- Estilos con SCSS; variables de diseño en `src/styles/_variables.scss`

### Backend (NestJS)
- Un módulo NestJS por feature (espeja la estructura de `frontend/features/`)
- DTOs con `class-validator` para toda entrada de datos
- Entidades TypeORM en `*.entity.ts`; migraciones para cambios de esquema
- Respuestas HTTP consistentes: `{ data, message, statusCode }`
- Guards JWT en rutas protegidas; todas las rutas lo son salvo `/auth/login` y `/auth/register`

### Base de datos
- SQLite como archivo único en `backend/studyboard.sqlite` (excluido de git)
- `synchronize: false` en producción; usar migraciones
- En desarrollo se puede usar `synchronize: true` para iterar rápido

## Flujo de autenticación

```
POST /auth/register  →  crea usuario, devuelve tokens
POST /auth/login     →  valida credenciales, devuelve tokens
POST /auth/refresh   →  intercambia refresh token por nuevo access token
```

El frontend almacena tokens en `localStorage` (aceptable para contexto de taller; en producción usar httpOnly cookies).

## Modelo de datos (resumen)

```
Usuario
  └─< Materia (color, créditos, docente)
        ├─< Tarea (título, descripción, estado, fechaEntrega)
        ├─< BloquesHorario (día, horaInicio, horaFin, aula)
        ├─< Calificacion (parcial, valor, ponderación)
        └─< Apunte (título, contenido Markdown, fechaActualización)
```

## Guía para contribuidores (estudiantes del taller)

1. Haz fork del repositorio y clona tu fork
2. Corre frontend y backend en modo desarrollo (ver comandos arriba)
3. Crea una rama descriptiva: `feature/nombre-funcionalidad` o `fix/descripción-bug`
4. Cada PR debe incluir: cambios de código + actualización de docs si aplica
5. Los commits siguen Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`

## Lo que Claude debe saber al trabajar en este proyecto

- El objetivo pedagógico es tan importante como el técnico: el código debe ser legible y servir de ejemplo para estudiantes que aprenden con IA
- Preferir soluciones simples y directas sobre abstracciones sofisticadas; este proyecto tiene que ser entendible por alguien que recién aprende Angular/NestJS
- SQLite es una decisión consciente (portabilidad para el taller), no cambiarla
- PrimeNG es la única librería de UI; no proponer alternativas
- Si una funcionalidad nueva no encaja en las features listadas, preguntar antes de crear estructura nueva
- Los tests unitarios son bienvenidos pero no bloquean el desarrollo en el contexto del taller
