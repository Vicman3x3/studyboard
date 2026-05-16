# StudyBoard — Esquema de Base de Datos

Diagrama entidad-relación completo del sistema. Generado a partir de la especificación oficial del modelo de datos.

---

```mermaid
erDiagram
    Usuario {
        uuid id PK
        string name
        string email UK
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    Semestre {
        uuid id PK
        string name
        date startDate
        date endDate
        boolean active
        uuid usuarioId FK
        datetime createdAt
        datetime updatedAt
    }

    Materia {
        uuid id PK
        string name
        string color
        int credits
        string teacher
        int semestreId FK
        datetime createdAt
        datetime updatedAt
    }

    Tarea {
        uuid id PK
        string title
        text description
        enum status
        enum priority
        date dueDate
        int materiaId FK
        datetime createdAt
        datetime updatedAt
    }

    BloqueHorario {
        uuid id PK
        enum day
        string startTime
        string endTime
        string classroom
        int materiaId FK
        datetime createdAt
        datetime updatedAt
    }

    CriterioEvaluacion {
        uuid id PK
        string name
        decimal weight
        int materiaId FK
        datetime createdAt
        datetime updatedAt
    }

    Parcial {
        uuid id PK
        int number
        string name
        date examDate
        int materiaId FK
        datetime createdAt
        datetime updatedAt
    }

    ItemTemario {
        uuid id PK
        string topic
        text subtopics
        int order
        int parcialId FK
        datetime createdAt
        datetime updatedAt
    }

    Calificacion {
        uuid id PK
        decimal value
        int parcialId FK
        int criterioId FK
        datetime createdAt
        datetime updatedAt
    }

    Documento {
        uuid id PK
        string fileName
        string filePath
        string mimeType
        int fileSize
        enum referenciaTipo
        int referenciaId
        int tareaId FK
        datetime createdAt
        datetime updatedAt
    }

    Usuario ||--o{ Semestre : "tiene"
    Semestre ||--o{ Materia : "contiene"
    Materia ||--o{ Tarea : "tiene"
    Materia ||--o{ BloqueHorario : "ocupa"
    Materia ||--o{ CriterioEvaluacion : "define"
    Materia ||--o{ Parcial : "divide en"
    Parcial ||--o{ ItemTemario : "incluye"
    Parcial ||--o{ Calificacion : "registra"
    CriterioEvaluacion ||--o{ Calificacion : "pondera"
    Tarea ||--o{ Documento : "adjunta"
```

---

## Notas del diagrama

- `weight` en `CriterioEvaluacion` es `decimal(5,2)` — representa el porcentaje de ponderación (p. ej. `30.00` para 30 %).
- `value` en `Calificacion` es `decimal(5,2)` — permite escala 0–100 con decimales.
- `startTime` y `endTime` en `BloqueHorario` se almacenan como cadena `HH:mm` (p. ej. `"08:00"`). No se usa tipo `TIME` de SQL para mantener compatibilidad con SQLite y facilitar la serialización JSON.
- `Documento.referenciaId` es un campo polimórfico genérico que apunta al id de la entidad referenciada (tarea o parcial) según `referenciaTipo`. La FK tipada solo existe en `tareaId` (nullable); el parcial se referencia solo mediante `referenciaTipo = 'parcial'` y `referenciaId`.
- El modelo completo se gestiona con TypeORM sobre SQLite. En desarrollo se usa `synchronize: true`; en producción se usan migraciones explícitas.
