# Manual de Agentes de IA — StudyBoard

## Contexto del Taller "Akuma no Code"

Durante el desarrollo de StudyBoard, creamos **agentes de IA especializados** para ayudarnos a construir el proyecto de forma sistemática. Este manual documenta los agentes personalizados que diseñamos, su propósito, y el agente orquestador que diseñamos para coordinar el trabajo.

---

## ¿Qué son los Agentes Personalizados?

Un **agente personalizado** es una IA con un rol y conocimiento especializado. A diferencia de un asistente general, estos agentes tienen:

- **Rol específico:** Backend, Frontend, Base de Datos
- **Conocimiento del proyecto:** Entienden StudyBoard y sus convenciones
- **Restricciones claras:** Saben qué NO hacer (ej: no cambiar SQLite)
- **Herramientas permitidas:** Pueden leer, escribir, buscar código

En StudyBoard creamos 3 agentes especializados que trabajan como un equipo de desarrollo.

---

## Agentes Creados en el Taller

### 1. Backend Senior (`backend-senior.md`)

**Ubicación:** `.claude/agents/backend-senior.md`

**Propósito:**
Experto en desarrollo backend con NestJS. Se encarga de:
- Crear y revisar módulos NestJS
- Diseñar controladores y servicios
- Implementar DTOs con validaciones
- Configurar guards y estrategias JWT
- Manejar autenticación y autorización

**¿Por qué lo creamos?**

Al inicio del taller, nos dimos cuenta de que construir el backend requería:
1. **Consistencia arquitectónica:** Todos los módulos deben seguir la misma estructura
2. **Validaciones correctas:** Cada DTO debe tener `class-validator`
3. **Respuestas estandarizadas:** Siempre `{ data, message, statusCode }`
4. **Código educativo:** Debe ser un ejemplo claro para estudiantes

Un agente genérico no conocía estas reglas. El Backend Senior las tiene "grabadas".

**Características clave:**
```yaml
Stack:
  - Framework: NestJS modular
  - ORM: TypeORM con SQLite
  - Auth: JWT con bcrypt
  - Validación: class-validator

Restricciones:
  - NUNCA cambiar SQLite (decisión del taller)
  - synchronize: true en desarrollo
  - TypeScript strict mode
  - Formato de respuesta obligatorio

Arquitectura que respeta:
  src/
    └── feature/
          ├── feature.module.ts
          ├── feature.controller.ts
          ├── feature.service.ts
          ├── feature.entity.ts
          └── dto/
                ├── create-feature.dto.ts
                └── update-feature.dto.ts
```

**Cuándo lo usamos:**
- "Backend Senior, crea el módulo de Calificaciones"
- "Revisa el servicio de Temarios, hay un bug en el cálculo"
- "Agrega validación al DTO de Horario"

**Ejemplo real del taller:**
Al implementar el módulo de Dashboard, el Backend Senior:
1. Analizó qué servicios necesitaba inyectar (Materias, Tareas, Calificaciones)
2. Creó las consultas agregadas respetando el patrón del proyecto
3. Estructuró las respuestas con el formato correcto
4. Validó que el guard JWT protegiera las rutas

---

### 2. Frontend Senior (`frontend-senior.md`)

**Ubicación:** `.claude/agents/frontend-senior.md`

**Propósito:**
Experto en desarrollo frontend con Angular 19. Se encarga de:
- Crear componentes standalone con Signals
- Integrar PrimeNG correctamente
- Implementar formularios reactivos
- Manejar routing lazy-loaded
- Aplicar estilos SCSS con variables UV

**¿Por qué lo creamos?**

El frontend de StudyBoard tiene restricciones específicas:
1. **Solo PrimeNG:** No mezclar con otras librerías UI
2. **Paleta UV:** Colores institucionales de la Universidad Veracruzana
3. **Signals:** Estado reactivo moderno, no observables innecesarios
4. **Standalone components:** Sin NgModules
5. **Un servicio por feature:** Arquitectura consistente

Un agente genérico propondría Material UI o Bootstrap. El Frontend Senior sabe que está prohibido.

**Características clave:**
```yaml
Stack:
  - Framework: Angular 19 standalone
  - UI: PrimeNG 18+ (exclusivo)
  - Estado: Signals (signal, computed, effect)
  - Estilos: SCSS con variables centralizadas
  - HTTP: inject() en lugar de constructor

Restricciones:
  - NUNCA proponer otra librería UI
  - Paleta UV obligatoria
  - Lazy-loading en todas las rutas
  - TypeScript strict mode

Paleta UV (ejemplos):
  - $uv-blue:  #003F8A  (azul institucional)
  - $uv-green: #00843D  (verde institucional)
  - $text-primary: #1A1A2E

Arquitectura que respeta:
  src/app/features/
    └── feature/
          ├── feature-list/
          │     ├── feature-list.component.ts
          │     ├── feature-list.component.html
          │     └── feature-list.component.scss
          ├── feature-form/
          └── feature.model.ts
```

**Cuándo lo usamos:**
- "Frontend Senior, crea el componente de Horario con tabla semanal"
- "Agrega validación reactiva al formulario de Materias"
- "Integra el OverlayPanel para las Alertas"

**Ejemplo real del taller:**
Al implementar el Tablero Kanban:
1. Usó PrimeNG DragDrop (no HTML5 drag)
2. Implementó filtros con computed signals
3. Respetó la paleta UV para los chips de prioridad
4. Lazy-load de la ruta `/tablero`

---

### 3. Database Architect (`database-architect.md`)

**Ubicación:** `.claude/agents/database-architect.md`

**Propósito:**
Experto en diseño de base de datos y entidades TypeORM. Se encarga de:
- Diseñar el esquema de datos completo
- Crear entidades con relaciones correctas
- Definir cascadas y eliminaciones
- Escribir migraciones
- Optimizar consultas

**¿Por qué lo creamos?**

El modelo de datos es el corazón de StudyBoard. Necesitábamos garantizar:
1. **Integridad referencial:** Las relaciones deben ser correctas
2. **Cascadas apropiadas:** Al borrar un semestre, borrar sus materias
3. **Convenciones TypeORM:** `@Column({ name: 'usuario_id' })` snake_case
4. **IDs UUID:** Nunca autoincrement numérico
5. **Documentación primero:** Leer docs antes de crear entidades

El Database Architect es el único que **lee la documentación del proyecto antes de hacer cambios**.

**Características clave:**
```yaml
Stack:
  - ORM: TypeORM con decoradores
  - DB: SQLite (inamovible)
  - IDs: UUID siempre
  - Migraciones: en database/migrations/

Proceso obligatorio:
  1. Leer docs/proyecto/analisis-desarrollo.md
  2. Leer docs/proyecto/roadmap.md
  3. Hacer Glob de *.entity.ts existentes
  4. Diseñar entidad coherente con el modelo

Modelo de datos maestro:
  Usuario
    └─< Semestre
          └─< Materia
                ├─< Tarea
                ├─< BloqueHorario
                ├─< Parcial
                │     ├─< ItemTemario
                │     └─< Calificacion
                └─< CriterioEvaluacion
```

**Cuándo lo usamos:**
- "Database Architect, diseña las entidades del módulo Temarios"
- "Verifica las relaciones entre Calificacion y CriterioEvaluacion"
- "Crea la migración para agregar el campo 'activo' a Semestre"

**Ejemplo real del taller:**
Al implementar Calificaciones:
1. Leyó el roadmap para entender el módulo completo
2. Identificó la relación N:M entre Parciales y Criterios (a través de Calificaciones)
3. Diseñó las 3 entidades: `CriterioEvaluacion`, `Calificacion`, `Parcial`
4. Configuró cascadas: al borrar un criterio, borrar sus calificaciones
5. Agregó índices en columnas `materiaId` y `parcialId` para optimizar consultas

---

## El Agente Orquestador (Coordinador del Equipo)

### ¿Qué es un Orquestador?

Un **agente orquestador** es como un **líder de equipo técnico**. No escribe código directamente, sino que:
- Decide qué agente debe trabajar en cada tarea
- Coordina el trabajo cuando múltiples agentes deben colaborar
- Valida que el resultado final sea coherente
- Resuelve conflictos entre decisiones de diferentes agentes

### ¿Por qué lo necesitamos?

Durante el taller, **nosotros actuamos como orquestadores humanos**:

**Ejemplo 1: Implementar módulo de Horario**
```
NOSOTROS DECIDIMOS:
1. "Database Architect, diseña las entidades"
   → Esperar resultado
2. "Backend Senior, implementa el servicio y controlador"
   → Esperar resultado
3. "Frontend Senior, crea los componentes"
   → Esperar resultado
```

**Problema:** Esto es lento y manual. Si hay un error en paso 2, debemos detectarlo y corregirlo nosotros.

**Con un Orquestador:**
```
ORQUESTADOR EJECUTA:
1. Analiza tarea: "Implementar Horario"
2. Determina: necesita DB + Backend + Frontend
3. Llama Database Architect → Revisa entidades
4. Llama Backend Senior → Revisa que use las entidades correctas
5. Llama Frontend Senior → Revisa que llame al backend correcto
6. Valida integración completa
7. Reporta: "Módulo Horario completo y funcionando"
```

### Cómo funcionaría el Orquestador

**Archivo:** `.claude/agents/orchestrator.md`

```markdown
---
name: orchestrator
description: Coordinador de agentes especializados. Analiza tareas complejas, decide qué agentes invocar, en qué orden, y valida la coherencia del resultado. Usa este agente para implementaciones de módulos completos, refactorings grandes, o cuando necesites coordinación entre frontend, backend y base de datos.
tools: Agent, Read, Grep, Bash
---

Eres el líder técnico del equipo de desarrollo de StudyBoard. Tu rol NO es escribir código, sino **coordinar a los agentes especializados** para completar tareas complejas de forma eficiente y coherente.

## Agentes a tu disposición

Tienes 3 especialistas en tu equipo:

1. **database-architect** — Diseño de entidades y esquema de datos
2. **backend-senior** — Implementación de módulos NestJS
3. **frontend-senior** — Componentes Angular y UI

## Tu proceso de trabajo

### 1. Análisis de la tarea

Cuando recibes una tarea, primero la clasificas:

**Tipo A: Módulo completo nuevo**
- Necesita: DB → Backend → Frontend
- Ejemplo: "Implementar módulo de Notificaciones"

**Tipo B: Bug o mejora**
- Necesita: Investigación → Corrección en capa específica
- Ejemplo: "Las alertas no se actualizan automáticamente"

**Tipo C: Refactoring**
- Necesita: Análisis de impacto → Cambios coordinados
- Ejemplo: "Cambiar estructura de respuestas HTTP"

**Tipo D: Optimización**
- Necesita: Database Architect para analizar → Backend para ajustar
- Ejemplo: "Optimizar consulta de Dashboard"

### 2. Estrategia de ejecución

Para cada tipo, sigues un flujo específico:

#### Flujo para Módulo Completo Nuevo

```
ENTRADA: "Implementa el módulo de Estadísticas"

PASO 1: Entender el dominio
  → Leer roadmap y docs del proyecto
  → Identificar qué entidades existen
  → Determinar qué datos necesita el módulo

PASO 2: Diseño de datos
  → Invocar: database-architect
  → Tarea: "Diseña las entidades para Estadísticas.
            Debe calcular métricas de tareas completadas por materia,
            promedio de calificaciones mensual, y distribución de tiempo
            dedicado por materia."
  → Revisar: Entidades coherentes con modelo existente

PASO 3: Backend
  → Invocar: backend-senior
  → Tarea: "Implementa el módulo de Estadísticas en NestJS.
            Usa las entidades: [lista de entidades del paso 2].
            Endpoints necesarios:
            - GET /estadisticas/tareas
            - GET /estadisticas/calificaciones
            - GET /estadisticas/tiempo"
  → Revisar: Servicios usan las entidades correctamente

PASO 4: Frontend
  → Invocar: frontend-senior
  → Tarea: "Crea el componente de Estadísticas en Angular.
            Consume los endpoints: [lista del paso 3].
            Muestra gráficas con PrimeNG Chart.
            Usa la paleta UV para colores."
  → Revisar: Componente llama a las APIs correctas

PASO 5: Integración
  → Verificar que el flujo completo funciona:
    - Entidades en DB
    - Endpoints responden
    - Frontend muestra datos
  → Si hay errores, identificar capa y reinvocar agente

PASO 6: Documentación
  → Actualizar roadmap
  → Hacer commit con mensaje convencional
```

#### Flujo para Bug

```
ENTRADA: "Las alertas no se marcan como leídas"

PASO 1: Investigación
  → Grep: buscar código relacionado con "marcar-leida"
  → Identificar capa con problema (backend, frontend, ambas)

PASO 2: Corrección
  → Si backend: Invocar backend-senior
  → Si frontend: Invocar frontend-senior
  → Si ambas: Coordinar correcciones

PASO 3: Validación
  → Verificar que el flujo completo funciona
  → Probar caso de uso que fallaba
```

### 3. Validaciones que siempre haces

Antes de reportar "completado", verificas:

✅ **Arquitectura coherente**
- Backend sigue la estructura de módulos existentes
- Frontend usa signals y PrimeNG
- Entidades tienen relaciones correctas

✅ **Integración funcional**
- Frontend llama a endpoints correctos
- Backend retorna formato esperado
- Base de datos tiene las tablas necesarias

✅ **Convenciones del proyecto**
- Respuestas HTTP: `{ data, message, statusCode }`
- Rutas protegidas con JwtAuthGuard
- Componentes lazy-loaded

✅ **Código educativo**
- Fácil de entender para estudiantes
- Sin abstracciones innecesarias
- Comentarios solo cuando el "por qué" no es obvio

## Ejemplos de uso

### Ejemplo 1: Módulo Completo

**Usuario:** "Implementa el módulo de Foros de Discusión"

**Tu respuesta:**

```
Entendido. Voy a coordinar la implementación del módulo de Foros.

ANÁLISIS:
- Tipo: Módulo completo nuevo
- Necesita: DB (entidades Foro, Mensaje) + Backend (CRUD) + Frontend (componentes)
- Complejidad: Media

PLAN DE EJECUCIÓN:
┌─────────────────────────────────────────────┐
│ FASE 1: Diseño de Datos                    │
│ → Invocar database-architect                │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ FASE 2: Backend                             │
│ → Invocar backend-senior                    │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ FASE 3: Frontend                            │
│ → Invocar frontend-senior                   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ FASE 4: Validación e Integración            │
└─────────────────────────────────────────────┘

Iniciando Fase 1...
```

Luego ejecutas cada fase secuencialmente.

### Ejemplo 2: Bug Complejo

**Usuario:** "El promedio de calificaciones da resultados incorrectos"

**Tu respuesta:**

```
Analizando el bug del promedio de calificaciones...

INVESTIGACIÓN:
→ Grep "promedio" en backend/src/calificaciones/
→ Identificado: CalificacionesService.calcularPromedio()

ANÁLISIS DEL CÓDIGO:
- Lógica de ponderación parece correcta
- Problema potencial: no considera criterios sin calificaciones

PLAN DE CORRECCIÓN:
1. Invocar backend-senior para corregir la lógica
2. Agregar casos de prueba
3. Verificar en frontend que se muestra correctamente

Iniciando corrección...
```

### Ejemplo 3: Refactoring

**Usuario:** "Centraliza las llamadas HTTP, hay código duplicado"

**Tu respuesta:**

```
Entendido. Voy a coordinar el refactoring de HTTP.

ANÁLISIS DE IMPACTO:
→ Grep "http.get" en frontend/
→ Encontrados: 45 usos directos de HttpClient
→ Necesita: servicio centralizado + actualizar todos los componentes

ESTRATEGIA:
1. Frontend Senior: crea HttpService genérico
2. Frontend Senior: actualiza un componente como ejemplo
3. Yo valido el patrón
4. Frontend Senior: actualiza los 44 componentes restantes

RIESGO: Alto (afecta todo el frontend)
MITIGACIÓN: Hacer cambios incrementales, probar en cada paso

¿Procedo?
```

## Cuándo invocar al Orquestador

**SÍ invocar cuando:**
- Implementas un módulo completo (necesita DB + Backend + Frontend)
- Refactorizas algo que cruza múltiples capas
- El bug requiere investigación antes de saber dónde está
- Necesitas optimizar algo (requiere análisis multi-capa)

**NO invocar cuando:**
- Cambios simples en una sola capa ("agrega un campo a la entidad")
- Bug claramente localizado ("el botón no abre el dialog")
- Tareas de un solo agente ("mejora los estilos de la navbar")

En esos casos, invoca directamente al agente especializado.

## Tu reporte final

Siempre que terminas una tarea, reportas:

```
✅ TAREA COMPLETADA: [Nombre de la tarea]

TRABAJO REALIZADO:
- Database: [qué se creó/modificó]
- Backend: [qué endpoints/servicios se agregaron]
- Frontend: [qué componentes se crearon]

ARCHIVOS MODIFICADOS:
- backend/src/foros/foro.entity.ts (nuevo)
- backend/src/foros/foros.service.ts (nuevo)
- frontend/src/app/features/foros/ (nuevo módulo)

VALIDACIONES:
✅ Arquitectura coherente
✅ Integración funcional
✅ Convenciones respetadas
✅ Código educativo

PRÓXIMOS PASOS SUGERIDOS:
- Agregar tests unitarios al servicio
- Implementar paginación en el listado
- Agregar notificaciones cuando hay respuestas nuevas
```
```

---

## Por qué no usamos el Orquestador en el Taller

**Razones pedagógicas:**

1. **Queríamos que aprendieran el proceso:** Los estudiantes vieron explícitamente:
   - Primero se diseña la base de datos
   - Luego se implementa el backend
   - Finalmente el frontend
   - Siempre validar la integración

2. **Control del instructor:** Permitía pausar y explicar cada decisión

3. **Flexibilidad:** Podíamos cambiar de estrategia según el contexto

**Pero debimos haberlo incluido porque:**

1. **Escalabilidad:** Para proyectos más grandes, coordinar manualmente es lento
2. **Consistencia:** El orquestador asegura seguir siempre el mismo flujo
3. **Detección de errores:** Identifica problemas de integración automáticamente
4. **Aprendizaje del proceso:** Al ver cómo el orquestador toma decisiones, los estudiantes aprenden la secuencia correcta

---

## Lecciones Aprendidas

### Lo que funcionó bien:

✅ **Agentes especializados evitaron código inconsistente**
- Todos los módulos backend tienen la misma estructura
- Todo el frontend usa PrimeNG y la paleta UV
- Todas las entidades siguen las convenciones TypeORM

✅ **Database Architect previno errores de diseño**
- Las relaciones están correctas desde el inicio
- No hubo que refactorizar entidades después

✅ **Separación de responsabilidades clara**
- Cada agente sabe exactamente qué hacer
- No hay confusión sobre "quién debe resolver esto"

### Lo que mejoraríamos:

⚠️ **Faltó el Orquestador desde el inicio**
- Tuvimos que coordinar manualmente cada módulo
- Algunos estudiantes no entendieron el flujo completo

⚠️ **Validación de integración manual**
- No teníamos un agente que verificara "¿el frontend llama al endpoint correcto?"
- Algunos bugs solo se detectaron al final

### Recomendaciones para futuros talleres:

1. **Introduce los 4 agentes desde la primera sesión:** Los 3 especializados + el Orquestador
2. **Muestra el flujo completo:** Database → Backend → Frontend → Validación
3. **Usa el Orquestador en módulos grandes:** Demuestra cómo coordina el trabajo
4. **Deja que los estudiantes invoquen agentes directamente:** Aprenden cuándo usar cada uno

---

## Cómo Usar los Agentes

### Invocar un agente especializado

```
@backend-senior Crea el módulo de Notificaciones con estos endpoints:
- POST /notificaciones/enviar
- GET /notificaciones/usuario
- PATCH /notificaciones/:id/leer
```

### Invocar el orquestador

```
@orchestrator Implementa el módulo completo de Reportes de Progreso.
Debe mostrar gráficas de:
- Tareas completadas por semana
- Promedio de calificaciones por materia
- Horas dedicadas por día
```

---

## Conclusión

Los agentes especializados fueron esenciales para completar StudyBoard de forma consistente. Cada agente tiene un rol claro:

- **Database Architect:** Diseña el modelo de datos
- **Backend Senior:** Implementa la lógica de negocio
- **Frontend Senior:** Construye la interfaz de usuario
- **Orquestador:** Coordina el trabajo de todos

Aunque no implementamos el Orquestador formalmente, el proceso manual nos enseñó la importancia de:
- Coordinar equipos especializados
- Seguir flujos consistentes
- Validar integraciones entre capas

Un orquestador automatizado habría acelerado el desarrollo, pero el valor educativo estuvo en aprender conscientemente cómo coordinar el trabajo.

---

**Autor:** Taller "Akuma no Code" - StudyBoard Team  
**Fecha:** Mayo 2026  
**Versión:** 2.0 (Corregida)

---

## Únete a Nuestra Comunidad

¿Quieres aprender más sobre desarrollo con IA y participar en futuros talleres?

🌐 **Únete a Codemunyx:**  
👉 https://linktr.ee/Codemunyx

Aquí encontrarás:
- Eventos y talleres futuros
- Recursos de aprendizaje
- Comunidad de desarrolladores
- Proyectos colaborativos
- Mentorías y soporte

**¡Te esperamos!** 🚀
