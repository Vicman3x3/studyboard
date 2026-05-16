# StudyBoard — Análisis de Desarrollo

> Documento generado a partir de los archivos `context/storyboar.md` y `context/ventanas.md`.  
> Fecha de análisis: 2026-05-14

---

## 1. Visión del producto

StudyBoard es una plataforma de gestión académica personal para estudiantes universitarios. El estudiante organiza su vida escolar en un solo lugar: horario, tareas, calificaciones, temarios y documentos — todo vinculado por semestre y por materia.

La propuesta de valor central es que **el sistema sabe en qué punto del semestre estás** y te ayuda a tomar decisiones: ¿qué necesito sacar en el siguiente parcial para aprobar? ¿Cuáles tareas vencen esta semana? ¿Cuántos créditos llevo?

---

## 2. Pantallas identificadas

| ID | Pantalla | Descripción |
|----|----------|-------------|
| P-01 | Login / Registro | Entrada al sistema con JWT |
| P-02 | Dashboard (inicio) | Hub central con accesos rápidos y métricas de avance |
| P-03 | Semestres | Lista de semestres; al hacer clic muestra materias del semestre |
| P-04 | Detalle de Materia | Información de la materia + tareas actuales + temario + calificaciones |
| P-05 | Tablero Kanban | Vista global de tareas: Pendiente / En progreso / Completada |
| P-06 | Horario semanal | Grilla Lun–Sáb con bloques por materia, editable |
| P-07 | Temarios | Por materia: agregar fecha de parciales y contenido del temario |
| P-08 | Avance académico | Calificaciones por materia, créditos acumulados, proyección de nota mínima |

---

## 3. Módulos del sistema (backend)

Derivados de las pantallas y la visión:

```
auth            →  registro, login, refresh token
usuarios        →  perfil del estudiante
semestres       →  contenedor de materias por período
materias        →  CRUD con color, créditos, docente
tareas          →  título, descripción, estado Kanban, fecha entrega, archivos adjuntos
horario         →  bloques horarios por materia (día, hora inicio, hora fin, aula)
temarios        →  parciales por materia + contenido del temario
calificaciones  →  parciales con ponderación + cálculo de promedio + proyección
documentos      →  archivos subidos por materia/parcial o asociados a una tarea
alertas         →  notificaciones de tareas próximas a vencer
```

---

## 4. Modelo de datos (preliminar)

```
Usuario
  └─< Semestre (nombre, fechaInicio, fechaFin, activo)
        └─< Materia (nombre, color, créditos, docente, semestre_id)
              ├─< Tarea (título, descripción, estado, prioridad, fechaEntrega, materia_id)
              │     └─< Documento (url, tipo, nombre, tarea_id)
              ├─< BloqueHorario (día, horaInicio, horaFin, aula)
              ├─< Parcial (número, fechaExamen, materia_id)
              │     ├─< ItemTemario (tema, subtemas, orden, parcial_id)
              │     ├─< Calificacion (valor, ponderacion, parcial_id)
              │     └─< Documento (url, tipo, nombre, parcial_id)
              └─< CriterioEvaluacion (nombre, ponderacion, materia_id)
```

**Nota sobre créditos:** La calificación final ponderada se calcula con los `CriterioEvaluacion` de cada materia. El sistema suma `valor × ponderacion / 100` para obtener el promedio. La proyección de nota mínima calcula el valor necesario en los criterios pendientes para alcanzar la calificación aprobatoria definida por el estudiante.

---

## 5. Funcionalidades por prioridad

### Fase 1 — Demo en vivo (taller, ~40 min de construcción)
- [ ] Auth (registro + login)
- [ ] CRUD de Materias (con color)
- [ ] Tablero Kanban: crear tarea, mover entre columnas, filtrar por materia

### Fase 2 — V1 para el día del taller
- [ ] Semestres: lista y navegación
- [ ] Horario semanal: visualización y edición
- [ ] Calificaciones: registro de parciales con ponderación
- [ ] Proyección de nota mínima por materia
- [ ] Dashboard: métricas de avance, próximas entregas
- [ ] Alertas in-app: tareas próximas a vencer (24–48h antes)
- [ ] Temarios: por materia, por parcial
- [ ] Acceso rápido desde Dashboard (los 6 atajos mencionados en el storyboard)

### Fase 3 — Issues abiertos para contribuciones
- [ ] Integración Google Calendar (tareas y fechas de examen)
- [ ] Carga de archivos (fotos, PDF por parcial y por tarea)
- [ ] Export de horario a PDF
- [ ] Recordatorios push (Service Worker / PWA)
- [ ] Dark mode
- [ ] Modo colaborativo (compartir materia con compañeros)

---

## 6. Flujo de navegación principal

```
Login
  └→ Dashboard
       ├→ Ver horario de clases        (P-06)
       ├→ Registrar tareas             (P-05 Kanban)
       ├→ Mostrar avances              (P-08)
       ├→ Ver calificaciones           (P-08)
       ├→ Ver temario por materia      (P-07)
       └→ Cargar documentos            (P-04 Detalle Materia)

Semestres (P-03)
  └→ Materia seleccionada (P-04)
       ├→ Tareas de la materia
       ├→ Temario + parciales
       └→ Calificaciones
```

---

## 7. Decisiones de arquitectura confirmadas

| Decisión | Justificación |
|----------|---------------|
| SQLite como base de datos | Portabilidad: cualquier estudiante clona y corre con `npm install`, sin Docker ni PostgreSQL |
| JWT con refresh token | Auth estándar, implementación didáctica y segura |
| Angular 19 standalone + Signals | Patrón moderno; elimina NgModules para código más legible |
| PrimeNG como única UI lib | Componentes listos (Kanban drag & drop, Calendar, DataTable); no mezclar con otras |
| TypeScript strict en ambos extremos | Ayuda a estudiantes a aprender buenas prácticas desde el inicio |

---

## 8. Recomendaciones

### 8.1 Agregar gestión de Semestres desde el inicio
El storyboard menciona semestres como contenedor principal de materias. La estructura actual de CLAUDE.md no los contempla explícitamente. Agregarlos como entidad padre de Materia hace que la app sea más realista y útil; sin semestres, todas las materias viven en un solo nivel y la historia de semestres anteriores se pierde.

### 8.2 Definir el modelo de créditos antes de construir Calificaciones
El storyboard menciona "conteo de créditos ponderado". Antes de implementar, definir:
- ¿Los créditos se suman al aprobar la materia o se contabilizan de otra forma?
- ¿Cuál es la escala de calificación (0–10, 0–100)?
- ¿Cuántos créditos necesita el estudiante para avanzar al siguiente semestre?

Esto evita refactorizaciones costosas en el modelo de datos.

### 8.3 Sistema de alertas — empezar in-app, no push
Las notificaciones push (Service Worker) tienen complejidad de implementación. Para V1, un badge en navbar + lista de alertas al abrir la app es suficiente y didácticamente más claro. Push queda bien como issue de contribución.

### 8.4 Carga de archivos — almacenamiento local en disco
Para el contexto del taller (sin nube), guardar archivos en `backend/uploads/` con una ruta en la base de datos es la solución más simple. Agregar un módulo `documentos` con `multer` en NestJS. Esto permite subir fotos de apuntes y PDFs de temarios sin depender de servicios externos.

### 8.5 Google Calendar como integración de Fase 3
La integración con Google Calendar requiere OAuth 2.0 y credenciales de API, lo que complica el onboarding ("cualquier estudiante clona y corre"). Mantenerla en Fase 3 como issue abierto es la decisión correcta. Si se implementa, usar un módulo opcional que solo se active si el usuario conecta su cuenta.

### 8.6 Vista "Próximas entregas" separada del Kanban
El storyboard habla de un tablero Kanban **y** una vista de entregas ordenadas por fecha. Son dos vistas del mismo dato (tareas), pero para usos distintos: el Kanban es para gestión del flujo de trabajo; la vista de entregas es para no olvidar fechas. Tenerlas separadas mejora la experiencia sin duplicar la lógica.

### 8.7 Onboarding del usuario nuevo
Al registrarse por primera vez, el dashboard estará vacío. Considerar un flujo de onboarding mínimo:
1. Crear semestre actual
2. Agregar primera materia
3. Redirigir al tablero

Sin esto, un estudiante que abre la app por primera vez no sabe por dónde empezar, lo que es especialmente relevante en el contexto del taller donde se hará una demo.

---

## 9. Riesgos y puntos de atención

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Modelo de datos sin semestres desde el inicio | Alto — refactor costoso | Agregar entidad Semestre en Fase 1 |
| Cálculo de promedio con reglas de negocio complejas | Medio | Definir fórmula exacta antes de implementar |
| Drag & drop del Kanban en móvil | Medio | PrimeNG OrderList/DragDrop funciona en móvil; testear temprano |
| SQLite con archivos adjuntos grandes | Bajo | Guardar solo la ruta del archivo en SQLite, no el binario |
| Scope creep del taller | Alto | Respetar las fases; Fase 3 es para contribuciones, no para el demo |

---

*Este documento debe actualizarse conforme avance el desarrollo. Los cambios de modelo de datos se reflejan en migraciones TypeORM.*
