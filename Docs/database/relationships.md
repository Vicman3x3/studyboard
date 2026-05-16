# StudyBoard — Mapa de Relaciones y Dependencias

Jerarquía de entidades, foreign keys del sistema y reglas de cascada.

---

## 1. Árbol de jerarquía

El modelo de datos tiene una estructura jerárquica estricta con `Usuario` como raíz. Todas las entidades dependen directa o indirectamente de un usuario.

```
Usuario
  └─< Semestre
        └─< Materia
              ├─< Tarea
              │     └─< Documento          (referenciaTipo = 'tarea')
              ├─< BloqueHorario
              ├─< CriterioEvaluacion
              │     └─< Calificacion       (FK criterioId)
              └─< Parcial
                    ├─< ItemTemario
                    ├─< Calificacion       (FK parcialId)
                    └─ Documento           (referenciaTipo = 'parcial', sin FK tipada)
```

**Profundidad máxima:** 5 niveles (Usuario → Semestre → Materia → Parcial → ItemTemario / Calificacion).

**Entidades hoja** (sin hijos): `BloqueHorario`, `ItemTemario`, `Documento`.

**Entidades con doble padre:** `Calificacion` depende tanto de `Parcial` (FK `parcialId`) como de `CriterioEvaluacion` (FK `criterioId`). Ambos deben pertenecer a la misma `Materia` — esta coherencia se valida en el servicio, no en la base de datos.

---

## 2. Tabla de Foreign Keys

Todas las FK del sistema, ordenadas por entidad origen.

| Entidad origen | Columna FK | Entidad destino | Columna destino | onDelete | Nullable |
|----------------|-----------|----------------|----------------|----------|----------|
| `Semestre` | `usuarioId` | `Usuario` | `id` | CASCADE | NO |
| `Materia` | `semestreId` | `Semestre` | `id` | CASCADE | NO |
| `Tarea` | `materiaId` | `Materia` | `id` | CASCADE | NO |
| `BloqueHorario` | `materiaId` | `Materia` | `id` | CASCADE | NO |
| `CriterioEvaluacion` | `materiaId` | `Materia` | `id` | CASCADE | NO |
| `Parcial` | `materiaId` | `Materia` | `id` | CASCADE | NO |
| `ItemTemario` | `parcialId` | `Parcial` | `id` | CASCADE | NO |
| `Calificacion` | `parcialId` | `Parcial` | `id` | CASCADE | NO |
| `Calificacion` | `criterioId` | `CriterioEvaluacion` | `id` | CASCADE | NO |
| `Documento` | `tareaId` | `Tarea` | `id` | CASCADE | SI |

**Total: 10 foreign keys** — 9 NOT NULL + 1 nullable (`Documento.tareaId`).

---

## 3. Reglas de cascada

Define qué ocurre automáticamente en la base de datos cuando se elimina cada entidad.

### Eliminar `Usuario`

```
Usuario (eliminado)
  → CASCADE → Semestre (todos los del usuario)
                → CASCADE → Materia
                              → CASCADE → Tarea
                              │             → CASCADE → Documento (tareaId)
                              → CASCADE → BloqueHorario
                              → CASCADE → CriterioEvaluacion
                              │             → CASCADE → Calificacion
                              → CASCADE → Parcial
                                            → CASCADE → ItemTemario
                                            → CASCADE → Calificacion
```

El borrado de un usuario elimina **todos** sus datos académicos. No existe papelera ni borrado suave en el modelo actual.

---

### Eliminar `Semestre`

```
Semestre (eliminado)
  → CASCADE → Materia (todas las del semestre)
                → CASCADE → Tarea → CASCADE → Documento
                → CASCADE → BloqueHorario
                → CASCADE → CriterioEvaluacion → CASCADE → Calificacion
                → CASCADE → Parcial → CASCADE → ItemTemario
                                    → CASCADE → Calificacion
```

Útil cuando el estudiante decide limpiar un semestre completo. El usuario sigue existiendo.

---

### Eliminar `Materia`

```
Materia (eliminada)
  → CASCADE → Tarea → CASCADE → Documento (tareaId)
  → CASCADE → BloqueHorario
  → CASCADE → CriterioEvaluacion → CASCADE → Calificacion
  → CASCADE → Parcial → CASCADE → ItemTemario
                       → CASCADE → Calificacion
```

Nota: los `Documento` con `referenciaTipo = 'parcial'` no tienen FK explícita hacia `Parcial`, por lo que su eliminación cuando se borra el parcial debe manejarse en el `DocumentosService` (ver sección 4).

---

### Eliminar `Tarea`

```
Tarea (eliminada)
  → CASCADE → Documento (tareaId NOT NULL y FK activa)
```

Los archivos físicos en `backend/uploads/` deben eliminarse manualmente desde el servicio antes o después de la eliminación del registro.

---

### Eliminar `CriterioEvaluacion`

```
CriterioEvaluacion (eliminado)
  → CASCADE → Calificacion (todas las que referencian este criterio)
```

Impacto: si se elimina un criterio que ya tiene calificaciones registradas, esas calificaciones desaparecen y el promedio de la materia cambia. El servicio debe advertir al usuario antes de ejecutar la eliminación.

---

### Eliminar `Parcial`

```
Parcial (eliminado)
  → CASCADE → ItemTemario
  → CASCADE → Calificacion (todas las del parcial)
```

Los `Documento` con `referenciaTipo = 'parcial'` y `referenciaId = parcial.id` quedan huérfanos en la base de datos (ver sección 4).

---

## 4. Casos que requieren limpieza manual en el servicio

Debido al diseño polimórfico de `Documento`, hay situaciones donde la cascada de base de datos no es suficiente y el servicio debe encargarse de la limpieza.

| Evento desencadenante | Acción requerida en el servicio |
|-----------------------|---------------------------------|
| `DELETE /parciales/:id` | Antes de eliminar el parcial, el `DocumentosService` debe buscar y eliminar todos los `Documento` donde `referenciaTipo = 'parcial'` y `referenciaId = parcialId`, incluyendo los archivos físicos en `uploads/`. |
| `DELETE /tareas/:id` | La cascada de BD elimina el registro `Documento`, pero el archivo físico en `uploads/` debe borrarse desde el `DocumentosService`. |
| `DELETE /materias/:id` | La cascada elimina `Parcial` → `Calificacion` e `ItemTemario`, y `Tarea` → `Documento` (registros). El servicio debe limpiar archivos físicos de tareas y documentos de parciales de esa materia. |

**Recomendación de implementación:** usar transacciones y un hook `@BeforeRemove()` de TypeORM en las entidades `Tarea` y `Parcial` para delegar la limpieza de archivos al `DocumentosService` antes de ejecutar el DELETE.

---

## 5. Integridad entre Calificacion, Parcial y CriterioEvaluacion

`Calificacion` tiene dos FK: `parcialId` y `criterioId`. Ambas entidades padre (`Parcial` y `CriterioEvaluacion`) deben pertenecer a la misma `Materia`. Esta coherencia no se puede garantizar con un FK constraint simple; se valida en el `CalificacionesService`:

```
// Antes de crear una Calificacion:
assert parcial.materiaId === criterio.materiaId
```

Si esta validación no se realiza, un estudiante podría registrar una calificación cruzando datos de materias distintas, rompiendo el cálculo del promedio.
