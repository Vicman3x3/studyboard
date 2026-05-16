# StudyBoard — Documentación de Entidades

Descripción detallada de cada entidad del sistema: propósito, campos, relaciones y decisiones de diseño.

---

## 1. Usuario

**Propósito:** Representa al estudiante que usa el sistema. Es la raíz de toda la jerarquía de datos — todos los demás registros pertenecen, directa o indirectamente, a un usuario.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente. Se usa UUID en lugar de entero para facilitar la portabilidad y evitar colisiones en exportaciones. |
| `name` | `VARCHAR` | NOT NULL | Nombre completo del estudiante. |
| `email` | `VARCHAR` | NOT NULL, UNIQUE | Dirección de correo. Es el identificador de inicio de sesión. |
| `passwordHash` | `VARCHAR` | NOT NULL | Hash bcrypt de la contraseña. Nunca se almacena la contraseña en texto plano. |
| `createdAt` | `DATETIME` | NOT NULL, DEFAULT now | Fecha/hora de registro. Gestionado por TypeORM (`@CreateDateColumn`). |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación del registro. Gestionado por TypeORM (`@UpdateDateColumn`). |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Semestre` | OneToMany | CASCADE — al eliminar un usuario se eliminan todos sus semestres y, en cascada, toda su información académica. |

### Decisiones de diseño

- Se usa UUID como PK para evitar que un atacante pueda iterar ids numéricos y acceder a datos de otro usuario. En el contexto del taller el riesgo es bajo, pero es una práctica correcta que sirve de ejemplo.
- `passwordHash` nunca se incluye en las respuestas de la API. El `AuthService` debe omitir este campo en todos los DTOs de respuesta.

---

## 2. Semestre

**Propósito:** Agrupa las materias de un período académico (p. ej. "Primavera 2026"). Permite al sistema mantener el historial de semestres anteriores y saber cuál está activo actualmente.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `name` | `VARCHAR` | NOT NULL | Nombre descriptivo del semestre (p. ej. "Semestre 2026-1"). |
| `startDate` | `DATE` | NOT NULL | Fecha de inicio del período académico. |
| `endDate` | `DATE` | NOT NULL | Fecha de fin del período académico. |
| `active` | `BOOLEAN` | NOT NULL, DEFAULT false | Indica si es el semestre en curso. Solo un semestre por usuario puede tener `active = true`. |
| `usuarioId` | `VARCHAR(36)` | FK → Usuario.id, NOT NULL | Usuario propietario del semestre. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Usuario` | ManyToOne | — (el semestre no puede existir sin usuario) |
| `Materia` | OneToMany | CASCADE — al borrar el semestre se eliminan todas sus materias y sus datos dependientes. |

### Decisiones de diseño

- La restricción de "solo un semestre activo" no se implementa como constraint de base de datos (SQLite tiene soporte limitado de partial unique indexes). Se gestiona en el `SemestresService`: al activar un semestre, se desactivan los demás del mismo usuario con una transacción.

---

## 3. Materia

**Propósito:** Representa una asignatura dentro de un semestre. Es el nodo central del modelo: tareas, horario, calificaciones y temario cuelgan de ella.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `name` | `VARCHAR` | NOT NULL | Nombre de la asignatura (p. ej. "Cálculo Diferencial"). |
| `color` | `VARCHAR(7)` | NOT NULL | Color en formato hexadecimal `#RRGGBB`. Se usa en la UI para diferenciar visualmente las materias. |
| `credits` | `INTEGER` | NOT NULL | Número de créditos de la asignatura. |
| `teacher` | `VARCHAR` | NULL | Nombre del docente. Nullable porque puede no conocerse al crear la materia. |
| `semestreId` | `INTEGER` | FK → Semestre.id, NOT NULL | Semestre al que pertenece. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Semestre` | ManyToOne | — |
| `Tarea` | OneToMany | CASCADE |
| `BloqueHorario` | OneToMany | CASCADE |
| `CriterioEvaluacion` | OneToMany | CASCADE |
| `Parcial` | OneToMany | CASCADE |

### Decisiones de diseño

- `color` se valida en el DTO con un regex `^#[0-9A-Fa-f]{6}$` para garantizar que siempre sea un hex válido de 6 dígitos. La UI usa PrimeNG ColorPicker que ya genera este formato.
- Los créditos son un entero (no decimal) porque los sistemas universitarios generalmente definen créditos como números enteros. Si algún sistema usa medios créditos, se puede cambiar a `DECIMAL(4,1)` sin afectar otras entidades.

---

## 4. Tarea

**Propósito:** Unidad de trabajo académico asociada a una materia. El estado de la tarea define en qué columna del tablero Kanban aparece.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `title` | `VARCHAR` | NOT NULL | Título corto de la tarea. |
| `description` | `TEXT` | NULL | Descripción detallada. Nullable para tareas simples que no requieren explicación. |
| `status` | `VARCHAR` | NOT NULL, DEFAULT 'pendiente' | Estado Kanban. Enum: `pendiente`, `en_progreso`, `completada`. |
| `priority` | `VARCHAR` | NOT NULL, DEFAULT 'media' | Prioridad. Enum: `baja`, `media`, `alta`. |
| `dueDate` | `DATE` | NULL | Fecha de entrega. Nullable porque algunas tareas no tienen fecha límite. |
| `materiaId` | `INTEGER` | FK → Materia.id, NOT NULL | Materia a la que pertenece. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Materia` | ManyToOne | — |
| `Documento` | OneToMany | CASCADE — los adjuntos de una tarea se eliminan con ella. |

---

## 5. BloqueHorario

**Propósito:** Define un bloque de tiempo recurrente en el horario semanal para una materia (p. ej. "Lunes de 08:00 a 10:00 en Aula 301").

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `day` | `VARCHAR` | NOT NULL | Día de la semana. Enum: `lunes`, `martes`, `miercoles`, `jueves`, `viernes`, `sabado`. |
| `startTime` | `VARCHAR(5)` | NOT NULL | Hora de inicio en formato `HH:mm` (p. ej. `"08:00"`). |
| `endTime` | `VARCHAR(5)` | NOT NULL | Hora de fin en formato `HH:mm` (p. ej. `"10:00"`). |
| `classroom` | `VARCHAR` | NULL | Aula o ubicación. Nullable. |
| `materiaId` | `INTEGER` | FK → Materia.id, NOT NULL | Materia a la que pertenece el bloque. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Materia` | ManyToOne | — |

### Decisiones de diseño

- `startTime` y `endTime` se almacenan como `VARCHAR(5)` en lugar de un tipo `TIME` de SQL porque SQLite no tiene tipo `TIME` nativo y el uso de strings `HH:mm` simplifica la serialización y comparación en JavaScript sin necesidad de librerías de fechas.
- La validación de que `endTime > startTime` se hace en el DTO con un validador personalizado de `class-validator`.

---

## 6. CriterioEvaluacion

**Propósito:** Define cómo se pondera la calificación final de una materia. Cada criterio tiene un porcentaje de peso. La suma de todos los pesos de una materia debería ser 100, aunque el sistema no lo obliga a nivel de base de datos (se valida en el servicio con una advertencia).

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `name` | `VARCHAR` | NOT NULL | Nombre del criterio (p. ej. "Primer Parcial", "Proyecto Final", "Tareas"). |
| `weight` | `DECIMAL(5,2)` | NOT NULL | Peso porcentual del criterio (p. ej. `30.00` para 30 %). |
| `materiaId` | `INTEGER` | FK → Materia.id, NOT NULL | Materia a la que pertenece. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Materia` | ManyToOne | — |
| `Calificacion` | OneToMany | CASCADE — al eliminar un criterio se eliminan todas las calificaciones asociadas. |

---

## 7. Parcial

**Propósito:** Representa un examen parcial o corte de una materia. Organiza el temario y agrupa las calificaciones registradas en ese corte.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `number` | `INTEGER` | NOT NULL | Número ordinal del parcial (1, 2, 3…). |
| `name` | `VARCHAR` | NULL | Nombre opcional (p. ej. "Primer Parcial"). Nullable para flexibilidad. |
| `examDate` | `DATE` | NULL | Fecha del examen. Nullable porque puede no estar definida al crear el parcial. |
| `materiaId` | `INTEGER` | FK → Materia.id, NOT NULL | Materia a la que pertenece. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Materia` | ManyToOne | — |
| `ItemTemario` | OneToMany | CASCADE — los temas del parcial se eliminan con él. |
| `Calificacion` | OneToMany | CASCADE — las calificaciones del parcial se eliminan con él. |

---

## 8. ItemTemario

**Propósito:** Representa un tema o unidad del temario dentro de un parcial. Permite al estudiante desglosar el contenido que debe estudiar y llevar control de avance.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `topic` | `VARCHAR` | NOT NULL | Nombre del tema (p. ej. "Derivadas parciales"). |
| `subtopics` | `TEXT` | NULL | Subtemas o notas en texto libre. Nullable. |
| `order` | `INTEGER` | NOT NULL | Posición del tema dentro del parcial. Permite reordenar la lista. |
| `parcialId` | `INTEGER` | FK → Parcial.id, NOT NULL | Parcial al que pertenece. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Parcial` | ManyToOne | — |

### Decisiones de diseño

- `order` se gestiona desde el frontend. Cuando el usuario reordena los ítems, el frontend envía los nuevos valores de `order` en un endpoint de actualización masiva (p. ej. `PATCH /temario/reorder`).

---

## 9. Calificacion

**Propósito:** Registra la nota obtenida en un criterio de evaluación para un parcial específico. La combinación de `parcialId` y `criterioId` define a qué corte y bajo qué criterio se obtuvo esa nota.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `value` | `DECIMAL(5,2)` | NOT NULL | Calificación obtenida (p. ej. `85.50`). Escala definida por el estudiante (típicamente 0–100). |
| `parcialId` | `INTEGER` | FK → Parcial.id, NOT NULL | Parcial en el que se obtuvo la calificación. |
| `criterioId` | `INTEGER` | FK → CriterioEvaluacion.id, NOT NULL | Criterio de evaluación al que corresponde. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Parcial` | ManyToOne | — |
| `CriterioEvaluacion` | ManyToOne | — |

### Decisiones de diseño

- No existe una restricción UNIQUE sobre `(parcialId, criterioId)` en la base de datos para no complicar la implementación en SQLite. La unicidad se valida en el servicio: antes de insertar, se verifica que no exista ya una calificación para esa combinación.
- `value` usa `DECIMAL(5,2)` para soportar cualquier escala (0–10 o 0–100) con dos decimales.

---

## 10. Documento

**Propósito:** Almacena la referencia a un archivo subido por el estudiante (foto de apunte, PDF de temario, etc.). El archivo físico reside en `backend/uploads/`; la entidad guarda la metadata y la ruta.

### Campos

| Columna | Tipo SQL | Restricciones | Descripción |
|---------|----------|---------------|-------------|
| `id` | `VARCHAR(36)` | PK, NOT NULL | UUID generado automáticamente por TypeORM. |
| `fileName` | `VARCHAR` | NOT NULL | Nombre original del archivo tal como lo subió el usuario. |
| `filePath` | `VARCHAR` | NOT NULL | Ruta relativa en el servidor donde se almacena el archivo (p. ej. `uploads/2026/05/foto.jpg`). |
| `mimeType` | `VARCHAR` | NOT NULL | Tipo MIME del archivo (p. ej. `image/jpeg`, `application/pdf`). |
| `fileSize` | `INTEGER` | NOT NULL | Tamaño en bytes del archivo. |
| `referenciaTipo` | `VARCHAR` | NOT NULL | Tipo de entidad a la que pertenece. Enum: `tarea`, `parcial`. |
| `referenciaId` | `INTEGER` | NOT NULL | ID de la entidad referenciada (polimórfico). |
| `tareaId` | `INTEGER` | FK → Tarea.id, NULL | FK tipada solo para tareas. Permite las cascadas de eliminación. Null cuando el documento pertenece a un parcial. |
| `createdAt` | `DATETIME` | NOT NULL | Fecha de creación. |
| `updatedAt` | `DATETIME` | NOT NULL | Última modificación. |

### Relaciones

| Entidad destino | Tipo | onDelete |
|----------------|------|----------|
| `Tarea` | ManyToOne | CASCADE — los documentos de una tarea se eliminan cuando se borra la tarea. |

### Decisiones de diseño

- Se usa un diseño polimórfico (`referenciaTipo` + `referenciaId`) para poder asociar documentos tanto a tareas como a parciales sin duplicar la entidad. El costo es perder la integridad referencial a nivel de base de datos para el caso del parcial; se acepta porque la complejidad de una tabla de unión completa no justifica el beneficio en el contexto del taller.
- `tareaId` existe como FK explícita (además de `referenciaId`) únicamente para habilitar la cascada de eliminación de TypeORM cuando se borra una tarea. Para parciales, la limpieza de documentos debe manejarse en el servicio.
- El archivo físico no se almacena en SQLite (solo la ruta). SQLite no está diseñado para almacenar archivos binarios grandes; guardar blobs degradaría el rendimiento.
