# Manual de Agentes de IA — StudyBoard

## Contexto del Taller "Akuma no Code"

Durante el desarrollo de StudyBoard, utilizamos agentes de inteligencia artificial (Claude Code) como asistentes de programación. Este manual documenta los agentes que creamos, su propósito y el agente orquestador que diseñamos para coordinar el trabajo.

---

## ¿Qué son los Agentes de IA?

Un **agente de IA** es un sistema autónomo que puede:
- Entender instrucciones en lenguaje natural
- Explorar y analizar código existente
- Escribir código nuevo siguiendo patrones establecidos
- Tomar decisiones sobre cómo resolver problemas técnicos
- Ejecutar herramientas (leer archivos, buscar en el código, hacer commits)

En nuestro taller, los agentes nos ayudaron a construir StudyBoard de forma sistemática y educativa.

---

## Agentes Utilizados en el Proyecto

### 1. Agent de Exploración (Explore Agent)

**Propósito:**
Especializado en explorar y buscar información en el código base rápidamente.

**¿Por qué lo creamos?**
- Al inicio del proyecto, necesitábamos entender la estructura de carpetas
- Cuando implementábamos un nuevo módulo, debíamos ver cómo estaban hechos los módulos anteriores para seguir el mismo patrón
- Para encontrar archivos específicos sin navegar manualmente

**Cuándo lo usamos:**
- "Busca todos los archivos de servicios en el backend"
- "Encuentra dónde se definen las rutas de API"
- "Muéstrame cómo se implementó el módulo de Materias"

**Ejemplo real del taller:**
Cuando fuimos a crear el módulo de Horario, usamos el Explore Agent para buscar cómo habíamos implementado el módulo de Materias, así seguimos el mismo patrón.

---

### 2. Agent de Propósito General (General-Purpose Agent)

**Propósito:**
Maneja tareas complejas que requieren múltiples pasos, investigación y toma de decisiones.

**¿Por qué lo creamos?**
- Algunas tareas requerían investigar, analizar y luego implementar
- Necesitábamos un agente que pudiera "pensar" sobre el problema antes de resolverlo
- Para tareas que involucraban múltiples archivos o módulos

**Cuándo lo usamos:**
- "Investiga por qué las alertas no se están mostrando correctamente"
- "Analiza el flujo de autenticación y encuentra el bug"
- "Refactoriza el código de calificaciones para soportar múltiples criterios"

**Ejemplo real del taller:**
Al implementar el sistema de calificaciones con promedio ponderado, este agente investigó cómo debía funcionar la lógica matemática, analizó las relaciones entre entidades y propuso la implementación.

---

### 3. Agent Planificador (Plan Agent)

**Propósito:**
Diseña estrategias de implementación antes de escribir código.

**¿Por qué lo creamos?**
- Queríamos evitar rehacer trabajo por no planear bien
- Necesitábamos que el agente nos presentara opciones de diseño
- Para que los estudiantes entendieran las decisiones arquitectónicas antes de implementar

**Cuándo lo usamos:**
- Antes de empezar cada módulo grande
- Cuando teníamos que tomar decisiones de arquitectura
- Para validar que nuestra aproximación era correcta

**Ejemplo real del taller:**
Antes de implementar el módulo de Dashboard, el Plan Agent analizó qué datos necesitábamos de otros módulos, propuso la estructura del servicio y nos mostró las dependencias.

---

## El Agente Orquestador (Que Nos Faltó)

### ¿Qué es un Orquestador?

Un **agente orquestador** es como un director de orquesta: coordina el trabajo de otros agentes especializados para completar tareas complejas de forma eficiente.

### ¿Por qué deberíamos haberlo creado?

Durante el taller, **nosotros actuamos como orquestadores humanos**:
- Decidíamos cuándo usar el Explore Agent vs el General-Purpose Agent
- Coordinábamos las tareas: "primero explora, luego planea, luego implementa"
- Dividíamos problemas grandes en subtareas manejables

Esto funcionó bien para aprender, pero un orquestador automatizado habría:

1. **Optimizado el flujo de trabajo:**
   - Detectar automáticamente qué tipo de tarea era
   - Asignar el agente correcto sin que lo pidiéramos
   - Ejecutar múltiples agentes en paralelo cuando era posible

2. **Reducido errores:**
   - Asegurar que siempre exploramos antes de modificar
   - Validar que planeamos antes de implementar módulos grandes
   - Verificar dependencias entre tareas

3. **Mejorado el aprendizaje:**
   - Mostrar explícitamente qué agente está trabajando y por qué
   - Registrar el proceso de toma de decisiones
   - Facilitar que otros estudiantes repliquen el proceso

### ¿Cómo funcionaría el Orquestador?

```
ENTRADA: "Implementa el módulo de Notificaciones"

ORQUESTADOR DECIDE:
1. Esto es una tarea compleja → Requiere planificación
2. Necesito entender módulos similares → Usar Explore Agent
3. Debo diseñar la arquitectura → Usar Plan Agent
4. Finalmente implementar → Usar General-Purpose Agent

FLUJO EJECUTADO:
┌──────────────────┐
│ Explore Agent    │ → Busca módulos de Alertas y Dashboard
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Plan Agent       │ → Diseña arquitectura de Notificaciones
└────────┬─────────┘
         ↓
┌──────────────────┐
│ General-Purpose  │ → Implementa backend + frontend
│ Agent            │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Resultado        │ → Módulo completo con tests
└──────────────────┘
```

### Implementación del Orquestador (Propuesta)

**Archivo:** `orchestrator-agent.md`

```markdown
# Agente Orquestador de StudyBoard

## Rol
Coordino el trabajo de agentes especializados para completar tareas complejas de desarrollo.

## Capacidades

### 1. Clasificación de Tareas
- **Exploración:** Buscar información en el código → Explore Agent
- **Investigación:** Analizar problemas complejos → General-Purpose Agent  
- **Planificación:** Diseñar arquitectura → Plan Agent
- **Implementación simple:** Cambios directos → Ejecución directa

### 2. Estrategias de Ejecución

**Para módulos nuevos:**
1. Explorar módulos similares existentes
2. Planear arquitectura del nuevo módulo
3. Implementar backend
4. Implementar frontend
5. Integrar y probar

**Para bugs:**
1. Explorar código relacionado
2. Investigar causa raíz
3. Implementar solución
4. Verificar que no rompe otras funcionalidades

**Para refactorings:**
1. Analizar código actual
2. Planear nueva estructura
3. Ejecutar refactoring incremental
4. Validar con tests

### 3. Reglas de Coordinación

- Nunca implementar sin explorar primero
- Siempre planear módulos con > 5 archivos
- Ejecutar agentes en paralelo cuando son independientes
- Validar resultados antes de continuar
- Hacer commit después de cada módulo completo

## Ejemplo de Uso

**Comando:** "Agrega un módulo de Estadísticas con gráficas"

**Decisión del Orquestador:**

```
ANÁLISIS:
- Tarea compleja: ✓ (nuevo módulo)
- Requiere exploración: ✓ (ver cómo hicimos Dashboard)
- Requiere planificación: ✓ (decidir qué estadísticas mostrar)
- Requiere múltiples agentes: ✓

PLAN DE EJECUCIÓN:
┌─────────────────────────────────────────────┐
│ FASE 1: Exploración (Explore Agent)        │
│ - Analizar módulo Dashboard                │
│ - Buscar librerías de gráficas en frontend │
│ - Revisar estructura de servicios de datos │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 2: Planificación (Plan Agent)         │
│ - Definir métricas a mostrar               │
│ - Elegir librería de gráficas (Chart.js)  │
│ - Diseñar endpoints del backend            │
│ - Proponer estructura de componentes       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 3: Implementación (General-Purpose)   │
│ - Backend: EstadisticasService + Controller│
│ - Frontend: EstadisticasComponent          │
│ - Integrar Chart.js                        │
│ - Agregar ruta en navbar                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ FASE 4: Validación                         │
│ - Verificar que compila                    │
│ - Probar endpoints en Postman              │
│ - Verificar UI en navegador                │
│ - Hacer commit                             │
└─────────────────────────────────────────────┘
```

**Salida para el usuario:**

```
✓ Exploración completada (3 archivos analizados)
✓ Plan de arquitectura aprobado
✓ Backend implementado (2 archivos creados)
✓ Frontend implementado (1 componente + ruta)
✓ Integración completa
✓ Commit realizado: "feat: módulo de Estadísticas con gráficas"

Próximos pasos sugeridos:
- Agregar más tipos de gráficas (torta, barras)
- Permitir exportar estadísticas a PDF
- Agregar filtros por fecha
```
```

### ¿Por qué no lo usamos en el taller?

**Razones pedagógicas:**
1. **Queríamos que aprendieran el proceso:** Los estudiantes vieron explícitamente cuándo explorar, cuándo planear y cuándo implementar
2. **Control del instructor:** Permitía pausar y explicar cada decisión
3. **Flexibilidad:** Podíamos cambiar de estrategia según el contexto del grupo

**Pero debimos haberlo incluido porque:**
1. **Escalabilidad:** Para proyectos más grandes, coordinar manualmente es ineficiente
2. **Consistencia:** El orquestador asegura seguir siempre el mismo proceso
3. **Replicabilidad:** Otros estudiantes pueden seguir el mismo flujo automáticamente

---

## Lecciones Aprendidas

### Lo que funcionó bien:
- Usar Explore Agent antes de cada implementación evitó código inconsistente
- Plan Agent nos salvó de refactorizar módulos completos
- General-Purpose Agent fue excelente para tareas complejas

### Lo que mejoraríamos:
- Crear el orquestador desde el inicio
- Documentar explícitamente qué agente usar en cada caso
- Agregar validaciones automáticas después de cada implementación

### Recomendaciones para futuros talleres:
1. Introduce el concepto de orquestador en la primera sesión
2. Muestra el flujo: Explorar → Planear → Implementar → Validar
3. Deja que los estudiantes decidan qué agente usar (con guía)
4. Usa el orquestador en las últimas sesiones cuando ya entiendan el proceso

---

## Conclusión

Los agentes de IA fueron esenciales para completar StudyBoard en el tiempo del taller. Aunque no implementamos un orquestador formal, el proceso manual nos enseñó:

- **Cuándo explorar:** Antes de modificar código existente
- **Cuándo planear:** Antes de tareas complejas (>5 archivos)
- **Cuándo implementar directo:** Cambios simples y bien entendidos

Un orquestador automatizaría estas decisiones, pero el valor educativo estuvo en aprenderlas conscientemente.

---

**Autor:** Taller "Akuma no Code" - StudyBoard Team  
**Fecha:** Mayo 2026  
**Versión:** 1.0

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

