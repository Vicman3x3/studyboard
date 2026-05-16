Agrega documentación JSDoc al archivo Angular indicado o al archivo actualmente abierto si no se especifica uno: $ARGUMENTS

## Lo que debes hacer

1. Lee el archivo objetivo completo
2. Identifica: nombre del componente/servicio/pipe/guard, su feature, su responsabilidad dentro de la arquitectura
3. Aplica la documentación siguiendo estrictamente las reglas de formato que se definen abajo
4. Reescribe el archivo con la documentación añadida — sin cambiar ninguna línea de lógica

---

## Regla 1 — Bloque @fileoverview al inicio del archivo

Coloca este bloque **antes** de cualquier import, como primera línea del archivo:

```typescript
/**
 * @fileoverview NombreComponente — descripción de una línea de qué hace este archivo.
 *
 * @module features/nombre-feature   (o core/ o shared/ según corresponda)
 * @description
 *   Párrafo breve (2-4 líneas) explicando la responsabilidad de este archivo dentro
 *   del sistema. Mencionar: qué problema resuelve, con qué entidades del dominio trabaja,
 *   y qué otros componentes o servicios lo usan o de quiénes depende.
 *
 * @example
 *   <!-- cómo se usa si es un componente, o cómo se inyecta si es un servicio -->
 */
```

**Reglas del bloque @fileoverview:**
- Primera línea: `NombreClase — descripción` sin punto final
- `@module` refleja la ruta real dentro de `src/app/`
- `@description` explica el *por qué* y el *contexto*, no el *qué* (eso ya lo dice el nombre)
- `@example` es obligatorio para componentes y servicios, opcional para guards/pipes simples
- Máximo 10 líneas en total — si se necesitan más, el componente tiene demasiadas responsabilidades

---

## Regla 2 — Comentarios inline a la derecha de cada propiedad

Los comentarios van **en la misma línea**, alineados a la derecha con suficientes espacios para que el código quede visualmente limpio. La columna de inicio de los comentarios debe ser consistente dentro de la clase (usa la línea más larga como referencia + 2 espacios).

```typescript
export class MateriaCardComponent {
  // — Inyecciones —
  private readonly materiasService = inject(MateriasService);    // CRUD de materias contra el backend

  // — Inputs / Outputs —
  readonly materia   = input.required<Materia>();                // Materia a renderizar en la tarjeta
  readonly onDelete  = output<string>();                         // Emite el id al confirmar eliminación
  readonly onEdit    = output<Materia>();                        // Emite la materia al solicitar edición

  // — Estado —
  protected readonly cargando     = signal(false);               // Bloquea acciones durante peticiones HTTP
  protected readonly confirmando  = signal(false);               // Activa el diálogo de confirmación

  // — Computed —
  protected readonly colorTexto = computed(                      // Blanco u oscuro según luminancia del color
    () => this.calcularColorTexto(this.materia().color)
  );
}
```

**Reglas de inline comments:**
- Siempre en la misma línea de la declaración, nunca en la línea de arriba
- Tiempo presente, tercera persona, sin sujeto: "Bloquea..." no "Esta propiedad bloquea..."
- Máximo 80 caracteres contando desde el inicio de la línea (código + espacios + comentario)
- Si el comentario no cabe en 80 chars, acortar la descripción — no romper en dos líneas
- No documentar lo obvio: `readonly id = input<string>()` no necesita `// id de la entidad`
- Sí documentar lo no obvio: un signal con nombre críptico, una computed con lógica especial, un output con contrato implícito

---

## Regla 3 — JSDoc en métodos con lógica no trivial

Para métodos públicos y privados que hagan más que una operación obvia:

```typescript
/**
 * Calcula si el texto sobre el color de fondo debe ser blanco o negro.
 * Usa la fórmula de luminancia relativa WCAG 2.1 para garantizar contraste AA.
 *
 * @param hex - Color en formato #RRGGBB
 * @returns '#ffffff' si el fondo es oscuro, '#1A1A2E' si es claro
 */
private calcularColorTexto(hex: string): string { ... }
```

**Cuándo aplica:**
- Métodos con lógica de negocio (cálculos, transformaciones, decisiones)
- Métodos con contratos implícitos en sus parámetros
- Métodos que llaman a la API (documentar qué endpoint y qué efecto secundario tiene)
- **No aplica** en métodos triviales de una línea ni en handlers simples como `onSubmit() { this.service.save(this.form.value) }`

---

## Regla 4 — Qué NO documentar

- Imports — nunca comentar bloques de import
- Decoradores `@Component`, `@Injectable` — su configuración habla por sí sola
- Getters triviales que solo devuelven una propiedad
- Constructores vacíos o con solo inyecciones
- Métodos cuyo nombre ya describe completamente lo que hacen: `loadMaterias()`, `closeDialog()`

---

## Formato de entrega

Al terminar, reporta en este formato exacto:

```
Archivo: ruta/relativa/del/archivo.ts
Bloque @fileoverview: ✅ agregado
Propiedades documentadas: N de M (las que aplicaban la regla)
Métodos documentados: N
Propiedades omitidas (obvias): lista de nombres
```

Si el archivo ya tenía alguna documentación previa, indícalo y describe qué se mantuvo, qué se reemplazó y qué se agregó.
