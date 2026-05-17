# StudyBoard — Roadmap de Desarrollo

> Mapa de tareas para completar el proyecto. Actualizar estado al terminar cada tarea.  
> Última actualización: 2026-05-16

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🔴 Alta | Prioridad alta — bloquea otras tareas o es parte del demo |
| 🟡 Media | Prioridad media — V1 completa |
| 🟢 Baja | Prioridad baja — mejora o Fase 3 |
| ⚡ Alta | Complejidad alta (>1 sesión de trabajo) |
| 🔶 Media | Complejidad media (~1 sesión) |
| 🔷 Baja | Complejidad baja (< 2h) |
| ⬜ | Pendiente |
| 🟦 | En progreso |
| ✅ | Completada |

---

## Estado general por módulo

| Módulo | Estado | Progreso |
|--------|--------|----------|
| 00 — Setup & Infraestructura | ✅ | 6 / 6 |
| 01 — Auth | ✅ | 10 / 10 |
| 02 — Semestres | ✅ | 8 / 8 |
| 03 — Materias | ✅ | 9 / 9 |
| 04 — Tablero Kanban | ✅ | 11 / 11 |
| 05 — Horario | ✅ | 8 / 8 |
| 06 — Temarios | ✅ | 9 / 9 |
| 07 — Calificaciones | ✅ | 10 / 10 |
| 08 — Dashboard | ✅ | 8 / 8 |
| 09 — Alertas | ⬜ | 0 / 6 |
| 10 — Documentos (Fase 3) | ⬜ | 0 / 8 |

**Total:** 79 / 93 tareas completadas (85%)

---

## FASE 1 — Demo en vivo (módulos del taller)

> Objetivo: construible en ~40 minutos en vivo. Debe funcionar end-to-end.

---

### 00 — Setup & Infraestructura

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| 00-01 | Inicializar proyecto Angular 19 con `ng new` en `/frontend` | 🔴 Alta | 🔷 Baja | — | ✅ |
| 00-02 | Instalar y configurar PrimeNG 19 + PrimeIcons + @primeuix/themes | 🔴 Alta | 🔷 Baja | 00-01 | ✅ |
| 00-03 | Configurar SCSS global y variables de diseño (`_variables.scss`) | 🔴 Alta | 🔷 Baja | 00-02 | ✅ |
| 00-04 | Inicializar proyecto NestJS en `/backend` | 🔴 Alta | 🔷 Baja | — | ✅ |
| 00-05 | Configurar TypeORM + SQLite en NestJS (`synchronize: true` para dev) | 🔴 Alta | 🔶 Media | 00-04 | ✅ |
| 00-06 | Configurar variables de entorno (`.env` backend + `environment.ts` frontend) | 🔴 Alta | 🔷 Baja | 00-04 | ✅ |

---

### 01 — Auth

> Prerequisito de todo el sistema. Bloquea cualquier otra pantalla.

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 01-01 | Entidad `Usuario` (id, nombre, email, passwordHash, createdAt) | 🔴 Alta | 🔷 Baja | 00-05 | ✅ |
| 01-02 | DTO `RegisterDto` y `LoginDto` con validaciones `class-validator` | 🔴 Alta | 🔷 Baja | 01-01 | ✅ |
| 01-03 | Servicio de hash de contraseñas con `bcrypt` | 🔴 Alta | 🔷 Baja | 01-01 | ✅ |
| 01-04 | Endpoints `POST /auth/register` y `POST /auth/login` | 🔴 Alta | 🔶 Media | 01-02, 01-03 | ✅ |
| 01-05 | Generación de access token + refresh token con `@nestjs/jwt` | 🔴 Alta | 🔶 Media | 01-04 | ✅ |
| 01-06 | Endpoint `POST /auth/refresh` para rotar tokens | 🔴 Alta | 🔶 Media | 01-05 | ✅ |
| 01-07 | `JwtAuthGuard` global — todas las rutas protegidas salvo auth | 🔴 Alta | 🔶 Media | 01-05 | ✅ |
| **FRONTEND** |
| 01-08 | Páginas `LoginComponent` y `RegisterComponent` con PrimeNG | 🔴 Alta | 🔶 Media | 01-04 | ✅ |
| 01-09 | `AuthService` — login, register, logout, almacenar tokens en `localStorage` | 🔴 Alta | 🔶 Media | 01-08 | ✅ |
| 01-10 | `AuthInterceptor` (adjunta Bearer token) + `AuthGuard` (protege rutas) | 🔴 Alta | 🔶 Media | 01-09 | ✅ |

---

### 03 — Materias

> Núcleo del demo. Se construye antes que Semestres para simplicidad del live coding.

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 03-01 | Entidad `Materia` (id, nombre, color, créditos, docente, usuario_id) | 🔴 Alta | 🔷 Baja | 01-01 | ✅ |
| 03-02 | CRUD completo `MateriasController` + `MateriasService` | 🔴 Alta | 🔶 Media | 03-01 | ✅ |
| 03-03 | DTOs `CreateMateriaDto` / `UpdateMateriaDto` | 🔴 Alta | 🔷 Baja | 03-01 | ✅ |
| **FRONTEND** |
| 03-04 | `MateriasService` — llamadas HTTP al backend | 🔴 Alta | 🔷 Baja | 03-02 | ✅ |
| 03-05 | `MateriasListComponent` — tarjetas de materias con color de chip | 🔴 Alta | 🔶 Media | 03-04 | ✅ |
| 03-06 | `MateriaFormComponent` — dialog con PrimeNG ColorPicker para crear/editar | 🔴 Alta | 🔶 Media | 03-04 | ✅ |
| 03-07 | Confirmación de eliminación con `ConfirmDialog` de PrimeNG | 🟡 Media | 🔷 Baja | 03-05 | ✅ |
| 03-08 | Ruta lazy-loaded `/materias` | 🔴 Alta | 🔷 Baja | 03-05 | ✅ |
| 03-09 | Badge de color en navbar/sidebar por materia activa | 🟡 Media | 🔷 Baja | 03-05 | ✅ |

---

### 04 — Tablero Kanban

> Pieza central del demo. La más visual e impactante para el taller.

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 04-01 | Entidad `Tarea` (id, título, descripción, estado, prioridad, fechaEntrega, materia_id) | 🔴 Alta | 🔷 Baja | 03-01 | ✅ |
| 04-02 | CRUD `TareasController` + `TareasService` | 🔴 Alta | 🔶 Media | 04-01 | ✅ |
| 04-03 | Endpoint `PATCH /tareas/:id/estado` para mover columna | 🔴 Alta | 🔷 Baja | 04-02 | ✅ |
| 04-04 | Filtro por materia en `GET /tareas?materia_id=` | 🔴 Alta | 🔷 Baja | 04-02 | ✅ |
| **FRONTEND** |
| 04-05 | `TareasService` — llamadas HTTP | 🔴 Alta | 🔷 Baja | 04-02 | ✅ |
| 04-06 | `KanbanBoardComponent` — 3 columnas con `pDragDrop` de PrimeNG | 🔴 Alta | ⚡ Alta | 04-05 | ✅ |
| 04-07 | `TareaCardComponent` — tarjeta con color de materia, prioridad, fecha | 🔴 Alta | 🔶 Media | 04-06 | ✅ |
| 04-08 | `TareaFormComponent` — dialog para crear/editar tarea (selector de materia + fecha) | 🔴 Alta | 🔶 Media | 04-05 | ✅ |
| 04-09 | Filtro por materia en el tablero (dropdown PrimeNG) | 🔴 Alta | 🔷 Baja | 04-06 | ✅ |
| 04-10 | Indicador visual de prioridad (Alta / Media / Baja) en tarjeta | 🟡 Media | 🔷 Baja | 04-07 | ✅ |
| 04-11 | Ruta lazy-loaded `/tablero` | 🔴 Alta | 🔷 Baja | 04-06 | ✅ |

---

## FASE 2 — V1 completa (día del taller)

---

### 02 — Semestres

> Contenedor padre de materias. Agrega contexto histórico al sistema.

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 02-01 | Entidad `Semestre` (id, nombre, fechaInicio, fechaFin, activo, usuario_id) | 🔴 Alta | 🔷 Baja | 01-01 | ✅ |
| 02-02 | CRUD `SemestresController` + `SemestresService` | 🔴 Alta | 🔶 Media | 02-01 | ✅ |
| 02-03 | Endpoint `PATCH /semestres/:id/activar` — solo un semestre activo a la vez | 🟡 Media | 🔷 Baja | 02-02 | ✅ |
| 02-04 | Relacionar `Materia` con `Semestre` (migración de FK) | 🔴 Alta | 🔶 Media | 02-01, 03-01 | ✅ |
| **FRONTEND** |
| 02-05 | `SemestresListComponent` — lista con estado activo/inactivo | 🔴 Alta | 🔶 Media | 02-02 | ✅ |
| 02-06 | `SemestreFormComponent` — dialog crear/editar con fechas PrimeNG Calendar | 🔴 Alta | 🔶 Media | 02-02 | ✅ |
| 02-07 | Navegación: clic en semestre → muestra materias del semestre | 🔴 Alta | 🔶 Media | 02-05, 03-05 | ✅ |
| 02-08 | Ruta lazy-loaded `/semestres` | 🔴 Alta | 🔷 Baja | 02-05 | ✅ |

---

### 05 — Horario

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 05-01 | Entidad `BloqueHorario` (id, día, horaInicio, horaFin, aula, materia_id) | 🟡 Media | 🔷 Baja | 03-01 | ✅ |
| 05-02 | CRUD `HorarioController` + `HorarioService` | 🟡 Media | 🔶 Media | 05-01 | ✅ |
| **FRONTEND** |
| 05-03 | `HorarioService` — llamadas HTTP | 🟡 Media | 🔷 Baja | 05-02 | ✅ |
| 05-04 | `HorarioGridComponent` — grilla Lun–Sáb con horas como filas | 🟡 Media | ⚡ Alta | 05-03 | ✅ |
| 05-05 | Bloques coloreados por materia dentro de la grilla | 🟡 Media | 🔶 Media | 05-04 | ✅ |
| 05-06 | `BloqueFormComponent` — dialog para agregar/editar bloque (día, horas, aula) | 🟡 Media | 🔶 Media | 05-03 | ✅ |
| 05-07 | Vista responsive: en móvil mostrar horario como lista por día | 🟢 Baja | 🔶 Media | 05-04 | ✅ |
| 05-08 | Ruta lazy-loaded `/horario` | 🟡 Media | 🔷 Baja | 05-04 | ✅ |

---

### 06 — Temarios

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 06-01 | Entidad `Parcial` (id, número, nombre, fechaExamen, materia_id) | 🟡 Media | 🔷 Baja | 03-01 | ✅ |
| 06-02 | Entidad `ItemTemario` (id, tema, subtemas, orden, parcial_id) | 🟡 Media | 🔷 Baja | 06-01 | ✅ |
| 06-03 | CRUD `TemarioController` + `TemarioService` | 🟡 Media | 🔶 Media | 06-01, 06-02 | ✅ |
| **FRONTEND** |
| 06-04 | `TemarioService` — llamadas HTTP | 🟡 Media | 🔷 Baja | 06-03 | ✅ |
| 06-05 | `TemarioComponent` — selector de materia → lista de parciales | 🟡 Media | 🔶 Media | 06-04 | ✅ |
| 06-06 | `ParcialFormComponent` — crear parcial con fecha de examen | 🟡 Media | 🔶 Media | 06-04 | ✅ |
| 06-07 | `ItemTemarioComponent` — agregar/editar/reordenar temas del parcial | 🟡 Media | 🔶 Media | 06-05 | ✅ |
| 06-08 | Indicador visual de parciales completados vs pendientes | 🟡 Media | 🔷 Baja | 06-05 | ✅ |
| 06-09 | Ruta lazy-loaded `/temarios` | 🟡 Media | 🔷 Baja | 06-05 | ✅ |

---

### 07 — Calificaciones

> Módulo con mayor lógica de negocio. Definir fórmulas antes de implementar.

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 07-01 | Entidad `CriterioEvaluacion` (id, nombre, ponderacion, materia_id) | 🟡 Media | 🔷 Baja | 03-01 | ✅ |
| 07-02 | Entidad `Calificacion` (id, valor, criterio_id, parcial_id) | 🟡 Media | 🔷 Baja | 07-01, 06-01 | ✅ |
| 07-03 | CRUD `CalificacionesController` + `CalificacionesService` | 🟡 Media | 🔶 Media | 07-01, 07-02 | ✅ |
| 07-04 | Endpoint `GET /calificaciones/promedio/:materia_id` — promedio ponderado | 🟡 Media | 🔶 Media | 07-03 | ✅ |
| 07-05 | Endpoint `GET /calificaciones/proyeccion/:materia_id` — nota mínima necesaria | 🟡 Media | ⚡ Alta | 07-04 | ✅ |
| **FRONTEND** |
| 07-06 | `CalificacionesService` — llamadas HTTP | 🟡 Media | 🔷 Baja | 07-03 | ✅ |
| 07-07 | `CriteriosComponent` — definir ponderaciones por materia | 🟡 Media | 🔶 Media | 07-06 | ✅ |
| 07-08 | `CalificacionesTablaComponent` — tabla por materia con valores y promedio | 🟡 Media | 🔶 Media | 07-06 | ✅ |
| 07-09 | `ProyeccionComponent` — muestra nota mínima necesaria con barra de progreso | 🟡 Media | 🔶 Media | 07-07 | ✅ |
| 07-10 | Ruta lazy-loaded `/calificaciones` | 🟡 Media | 🔷 Baja | 07-08 | ✅ |

---

### 08 — Dashboard

> Pantalla de inicio. Se construye al final porque agrega datos de todos los módulos.

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 08-01 | Endpoint `GET /dashboard/resumen` — métricas agregadas del usuario | 🔴 Alta | ⚡ Alta | 03, 04, 07 | ✅ |
| 08-02 | Endpoint `GET /dashboard/proximas-entregas` — tareas 7 días hacia adelante | 🔴 Alta | 🔶 Media | 04-01 | ✅ |
| **FRONTEND** |
| 08-03 | `DashboardService` — llamadas HTTP | 🔴 Alta | 🔷 Baja | 08-01 | ✅ |
| 08-04 | `DashboardComponent` — layout con grid de widgets PrimeNG | 🔴 Alta | ⚡ Alta | 08-03 | ✅ |
| 08-05 | Widget: "¿Qué quieres hacer hoy?" — 6 accesos rápidos (storyboard) | 🔴 Alta | 🔷 Baja | 08-04 | ✅ |
| 08-06 | Widget: Próximas entregas (lista ordenada por fecha) | 🔴 Alta | 🔶 Media | 08-04 | ✅ |
| 08-07 | Widget: Promedio general + materias activas + tareas completadas | 🔴 Alta | 🔶 Media | 08-04 | ✅ |
| 08-08 | Flujo de onboarding mínimo para usuario nuevo (sin materias registradas) | 🟡 Media | 🔶 Media | 08-04 | ✅ |

---

### 09 — Alertas

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 09-01 | Endpoint `GET /alertas` — tareas con fechaEntrega en las próximas 48h no completadas | 🟡 Media | 🔶 Media | 04-01 | ⬜ |
| 09-02 | Endpoint `POST /alertas/marcar-leida/:id` | 🟡 Media | 🔷 Baja | 09-01 | ⬜ |
| **FRONTEND** |
| 09-03 | `AlertasService` — polling cada 5 minutos | 🟡 Media | 🔶 Media | 09-01 | ⬜ |
| 09-04 | Badge numérico en navbar con conteo de alertas activas | 🟡 Media | 🔷 Baja | 09-03 | ⬜ |
| 09-05 | Panel overlay de alertas al hacer clic en el badge (PrimeNG OverlayPanel) | 🟡 Media | 🔶 Media | 09-04 | ⬜ |
| 09-06 | Toast automático al entrar a la app si hay alertas nuevas | 🟢 Baja | 🔷 Baja | 09-03 | ⬜ |

---

## FASE 3 — Issues abiertos para contribuciones

---

### 10 — Documentos y archivos

| # | Tarea | Prioridad | Complejidad | Dep. | Estado |
|---|-------|-----------|-------------|------|--------|
| **BACKEND** |
| 10-01 | Configurar `multer` en NestJS para subida de archivos | 🟢 Baja | 🔶 Media | 00-04 | ⬜ |
| 10-02 | Entidad `Documento` (id, nombre, url, tipo, tamaño, referencia_tipo, referencia_id) | 🟢 Baja | 🔷 Baja | 10-01 | ⬜ |
| 10-03 | Endpoints `POST /documentos/upload` y `GET /documentos/:id` | 🟢 Baja | 🔶 Media | 10-02 | ⬜ |
| 10-04 | Servir archivos estáticos desde `backend/uploads/` | 🟢 Baja | 🔷 Baja | 10-03 | ⬜ |
| **FRONTEND** |
| 10-05 | `DocumentosService` — subida y descarga | 🟢 Baja | 🔶 Media | 10-03 | ⬜ |
| 10-06 | `FileUploaderComponent` — componente reutilizable con PrimeNG FileUpload | 🟢 Baja | 🔶 Media | 10-05 | ⬜ |
| 10-07 | Integrar uploader en `DetalleMateriaComponent` (por parcial) | 🟢 Baja | 🔶 Media | 10-06 | ⬜ |
| 10-08 | Integrar uploader en `TareaFormComponent` (adjuntos por tarea) | 🟢 Baja | 🔶 Media | 10-06 | ⬜ |

### Issues adicionales (sin descomponer aún)

| Issue | Prioridad | Complejidad |
|-------|-----------|-------------|
| Integración Google Calendar (OAuth 2.0 + API) | 🟢 Baja | ⚡ Alta |
| Export de horario a PDF | 🟢 Baja | 🔶 Media |
| Notificaciones push (PWA + Service Worker) | 🟢 Baja | ⚡ Alta |
| Dark mode (variables CSS + toggle) | 🟢 Baja | 🔶 Media |
| Proyección de calificación final avanzada | 🟢 Baja | ⚡ Alta |
| Modo colaborativo (compartir materia) | 🟢 Baja | ⚡ Alta |

---

## Mapa de dependencias

```
00-Setup
  └─→ 01-Auth
        └─→ 02-Semestres ──────────────────────────────┐
        └─→ 03-Materias ──────────────────────────────┐ │
              └─→ 04-Kanban ← (DEMO LISTO)            │ │
              └─→ 05-Horario                           │ │
              └─→ 06-Temarios                          │ │
              └─→ 07-Calificaciones                    │ │
                                                       ↓ ↓
              └─→ 08-Dashboard ← (necesita 02,03,04,07)
              └─→ 09-Alertas ← (necesita 04)

10-Documentos (independiente, Fase 3)
```

---

## Orden de desarrollo recomendado

```
Semana 1 — Base funcional (DEMO)
  1. Setup (00-01 → 00-06)
  2. Auth backend (01-01 → 01-07)
  3. Auth frontend (01-08 → 01-10)
  4. Materias (03-01 → 03-08)
  5. Kanban (04-01 → 04-11)
  ✓ DEMO funciona: login → crear materias → crear tareas → mover columnas

Semana 2 — V1 parte A
  6. Semestres (02-01 → 02-08)
  7. Horario (05-01 → 05-08)
  8. Temarios (06-01 → 06-09)

Semana 3 — V1 parte B
  9. Calificaciones (07-01 → 07-10)
  10. Dashboard (08-01 → 08-08)
  11. Alertas (09-01 → 09-06)
  ✓ V1 completa lista para el taller

Fase 3 — Después del taller
  12. Documentos (10-01 → 10-08)
  13. Issues abiertos (contribuciones de estudiantes)
```

---

*Actualizar el estado de cada tarea con ✅ al completar. Actualizar la tabla de "Estado general" al cerrar cada módulo.*
