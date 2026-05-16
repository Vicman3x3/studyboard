# StudyBoard — Diccionario de Datos

Definición de enums, reglas de negocio embebidas en el modelo y fórmulas de cálculo que dependen de la estructura de datos.

---

## 1. Enums del sistema

### TareaEstado

Columna: `Tarea.status` · Tipo almacenado: `VARCHAR`

| Valor | Etiqueta UI | Significado |
|-------|-------------|-------------|
| `pendiente` | Pendiente | La tarea fue creada pero no se ha empezado a trabajar en ella. Columna inicial del tablero Kanban. |
| `en_progreso` | En progreso | El estudiante está trabajando activamente en la tarea. Columna central del tablero. |
| `completada` | Completada | La tarea fue entregada o finalizada. Columna final del tablero. |

- Valor por defecto: `pendiente`
- Transiciones válidas: cualquier columna puede moverse a cualquier otra (sin restricción en la base de datos; el tablero permite libre arrastre).

---

### TareaPrioridad

Columna: `Tarea.priority` · Tipo almacenado: `VARCHAR`

| Valor | Etiqueta UI | Significado |
|-------|-------------|-------------|
| `baja` | Baja | Tarea que puede posponerse sin consecuencias inmediatas. |
| `media` | Media | Tarea con plazo moderado o impacto medio en la calificación. |
| `alta` | Alta | Tarea urgente o de alto impacto. Se resalta visualmente en la tarjeta Kanban. |

- Valor por defecto: `media`
- No existe un nivel "crítica" para mantener la interfaz simple.

---

### DiaSemana

Columna: `BloqueHorario.day` · Tipo almacenado: `VARCHAR`

| Valor | Etiqueta UI | Orden de visualización |
|-------|-------------|------------------------|
| `lunes` | Lunes | 1 |
| `martes` | Martes | 2 |
| `miercoles` | Miércoles | 3 |
| `jueves` | Jueves | 4 |
| `viernes` | Viernes | 5 |
| `sabado` | Sábado | 6 |

- El domingo no está incluido porque el calendario universitario estándar en México no contempla clases en domingo.
- "miercoles" se almacena sin tilde para evitar problemas de codificación en sistemas que no manejen UTF-8 correctamente en identificadores.
- El orden de visualización se aplica en el frontend al renderizar la grilla del horario; la base de datos no lo impone.

---

### DocumentoReferencia

Columna: `Documento.referenciaTipo` · Tipo almacenado: `VARCHAR`

| Valor | Etiqueta UI | Entidad referenciada |
|-------|-------------|----------------------|
| `tarea` | Tarea | El documento es un adjunto de una `Tarea`. En este caso `Documento.tareaId` también estará poblado. |
| `parcial` | Parcial | El documento es material de estudio asociado a un `Parcial` (p. ej. apuntes, PDF del temario). |

- Este enum hace parte del patrón de asociación polimórfica: `referenciaTipo` identifica la tabla destino y `referenciaId` contiene el ID del registro.

---

## 2. Reglas de negocio embebidas en el modelo

### 2.1 Un solo semestre activo por usuario

**Campo involucrado:** `Semestre.active`

- En cualquier momento, solo un semestre de un usuario puede tener `active = true`.
- Regla no implementada como constraint de BD (SQLite tiene soporte limitado de partial unique indexes).
- Implementación en servicio: al ejecutar `PATCH /semestres/:id/activar`, el `SemestresService` abre una transacción que primero actualiza `active = false` en todos los semestres del usuario y luego establece `active = true` en el semestre solicitado.

### 2.2 Color de materia en formato hexadecimal

**Campo involucrado:** `Materia.color`

- Restricción: cadena de exactamente 7 caracteres con formato `#RRGGBB`.
- Validación en DTO con `class-validator`: `@Matches(/^#[0-9A-Fa-f]{6}$/)`.
- No existe CHECK constraint en SQLite para esto; la validación es responsabilidad del DTO.

### 2.3 Hora de fin posterior a hora de inicio en bloques horarios

**Campos involucrados:** `BloqueHorario.startTime`, `BloqueHorario.endTime`

- `endTime` debe ser estrictamente mayor que `startTime`.
- Validación en DTO con un validador personalizado `class-validator`.
- No hay overlapping check en la base de datos; si el usuario define bloques que se solapan dentro de la misma materia, la base de datos lo permite. El frontend puede mostrar una advertencia visual.

### 2.4 Valor de calificación

**Campo involucrado:** `Calificacion.value`

- Tipo: `DECIMAL(5,2)` — soporta valores de hasta `999.99`.
- Rango esperado: `0.00` a `100.00` (escala 0–100).
- No existe CHECK constraint; la validación se hace en el DTO con `@Min(0)` y `@Max(100)`.

### 2.5 Peso de criterio de evaluación

**Campo involucrado:** `CriterioEvaluacion.weight`

- Tipo: `DECIMAL(5,2)`.
- Rango esperado: `0.01` a `100.00`.
- Los pesos de todos los criterios de una materia idealmente suman 100. No es un constraint de BD; el servicio puede emitir una advertencia (no un error) si la suma difiere de 100.
- Un peso de `0` es inválido y se rechaza en el DTO con `@Min(0.01)`.

### 2.6 Unicidad de calificación por parcial y criterio

**Campos involucrados:** `Calificacion.parcialId`, `Calificacion.criterioId`

- No debe existir más de una calificación para la misma combinación de parcial y criterio.
- Implementado en el servicio: antes de insertar, `CalificacionesService` consulta si ya existe una calificación para `(parcialId, criterioId)`. Si existe, lanza un `ConflictException`.
- Si el usuario quiere corregir una calificación, debe usar `PUT /calificaciones/:id`.

---

## 3. Fórmulas de cálculo

### 3.1 Promedio ponderado de una materia

Calcula la calificación actual de una materia considerando únicamente los criterios que ya tienen calificación registrada.

**Variables:**
- `C` = conjunto de `CriterioEvaluacion` de la materia que tienen al menos una `Calificacion` registrada.
- `v_i` = `Calificacion.value` del criterio `i`.
- `w_i` = `CriterioEvaluacion.weight` del criterio `i`.

**Fórmula:**

```
promedio_materia = Σ(v_i × w_i) / Σ(w_i)    para todo i ∈ C
```

**Ejemplo:**

| Criterio | Peso (`w_i`) | Calificación (`v_i`) | `v_i × w_i` |
|----------|-------------|----------------------|-------------|
| Parcial 1 | 30 | 85 | 2550 |
| Parcial 2 | 30 | 72 | 2160 |
| Proyecto | 40 | — | — (no registrado) |

```
promedio_actual = (2550 + 2160) / (30 + 30) = 4710 / 60 = 78.50
```

El criterio "Proyecto" se excluye del cálculo porque no tiene calificación. Esto refleja el avance actual, no la calificación final proyectada.

**Notas de implementación:**
- Si ningún criterio tiene calificación, el promedio es `null` (no `0`).
- Los criterios con calificación `0.00` sí se incluyen en el cálculo (un cero registrado es diferente a "sin calificación").

---

### 3.2 Proyección de nota mínima necesaria

Calcula la calificación que el estudiante necesita obtener en los criterios pendientes para alcanzar una calificación aprobatoria definida por él.

**Variables:**
- `T` = conjunto de todos los `CriterioEvaluacion` de la materia.
- `R` = subconjunto de `T` con calificación ya registrada.
- `P` = subconjunto de `T` sin calificación (`P = T - R`).
- `v_i` = calificación registrada para criterio `i ∈ R`.
- `w_i` = peso del criterio `i`.
- `G` = calificación aprobatoria deseada (definida por el usuario, p. ej. `60`).

**Fórmula:**

```
nota_necesaria = (G × Σ(w_i para todo i ∈ T) - Σ(v_i × w_i para todo i ∈ R)) / Σ(w_i para todo i ∈ P)
```

**Ejemplo (continuación del anterior):**

```
G = 60
Σ(todos los pesos) = 30 + 30 + 40 = 100
Σ(registrados × pesos) = 85×30 + 72×30 = 2550 + 2160 = 4710
Σ(pesos pendientes) = 40

nota_necesaria = (60×100 - 4710) / 40 = (6000 - 4710) / 40 = 1290 / 40 = 32.25
```

El estudiante necesita al menos `32.25` en el Proyecto Final para aprobar con 60.

**Casos especiales:**

| Caso | Comportamiento |
|------|---------------|
| `Σ(pesos_pendientes) = 0` | No hay criterios pendientes; devolver `null` (ya no hay nada que calcular). |
| `nota_necesaria > 100` | El estudiante ya no puede aprobar con los criterios pendientes; devolver la nota calculada de todas formas para que el frontend muestre el mensaje "No es posible alcanzar la calificación aprobatoria". |
| `nota_necesaria ≤ 0` | El estudiante ya aprobó aunque saque 0 en todo lo pendiente; devolver `0` o un indicador especial. |
| Ningún criterio tiene calificación | `nota_necesaria = G` (necesita exactamente la aprobatoria en promedio ponderado). |

**Notas de implementación:**
- `G` se recibe como parámetro en el endpoint: `GET /calificaciones/proyeccion/:materiaId?aprobatoria=60`.
- Valor por defecto sugerido: `60` (aprobatoria común en universidades mexicanas).
- Si los pesos de la materia no suman exactamente 100, la fórmula sigue siendo válida pero el resultado debe interpretarse en función de la escala de pesos real, no de 100.
