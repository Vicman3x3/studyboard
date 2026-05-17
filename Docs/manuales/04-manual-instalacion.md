# Manual de Instalación — StudyBoard

**Guía paso a paso para estudiantes**

---

## Antes de Empezar

Este manual está diseñado para estudiantes que están comenzando en programación. **No te preocupes si no conoces algunos términos**, los explicaremos todos.

---

## Tabla de Contenidos

1. [¿Qué vamos a instalar?](#qué-vamos-a-instalar)
2. [Tecnologías Necesarias](#tecnologías-necesarias)
3. [Paso 1: Instalar Node.js](#paso-1-instalar-nodejs)
4. [Paso 2: Instalar Git](#paso-2-instalar-git)
5. [Paso 3: Instalar un Editor de Código](#paso-3-instalar-un-editor-de-código)
6. [Paso 4: Descargar StudyBoard](#paso-4-descargar-studyboard)
7. [Paso 5: Configurar el Backend](#paso-5-configurar-el-backend)
8. [Paso 6: Configurar el Frontend](#paso-6-configurar-el-frontend)
9. [Paso 7: Ejecutar StudyBoard](#paso-7-ejecutar-studyboard)
10. [Solución de Problemas](#solución-de-problemas)

---

## ¿Qué vamos a instalar?

Para que StudyBoard funcione en tu computadora necesitas:

1. **Node.js** — El "motor" que ejecuta JavaScript fuera del navegador
2. **Git** — Herramienta para descargar el código de StudyBoard
3. **Un editor de código** — Donde podrás ver y editar el código (recomendamos VS Code)
4. **El código de StudyBoard** — El proyecto completo

Una vez instalado todo, podrás:
- ✅ Ejecutar StudyBoard en tu computadora
- ✅ Ver cómo funciona por dentro
- ✅ Hacer cambios y mejoras
- ✅ Aprender programación web moderna

---

## Tecnologías Necesarias

Antes de instalar, entendamos **qué es cada cosa** y **por qué la usamos**.

### Node.js

**¿Qué es?**  
Node.js es un **entorno de ejecución de JavaScript**. Normalmente, JavaScript solo corre en navegadores web. Node.js permite ejecutarlo en tu computadora, como cualquier otro programa.

**¿Para qué sirve?**  
- Ejecutar el backend (servidor) de StudyBoard
- Instalar dependencias (librerías que usa el proyecto)
- Ejecutar herramientas de desarrollo

**¿Por qué lo usamos?**  
Porque tanto el frontend (Angular) como el backend (NestJS) están escritos en JavaScript/TypeScript, y Node.js permite ejecutar ambos.

**Analogía:** Si JavaScript fuera un idioma, Node.js sería como poder hablar ese idioma fuera de tu casa (navegador), en cualquier lugar (tu computadora).

---

### Git

**¿Qué es?**  
Git es un **sistema de control de versiones**. Piensa en él como un "historial de cambios" para código.

**¿Para qué sirve?**  
- Descargar código de internet (como StudyBoard desde GitHub)
- Guardar cambios que haces al código
- Ver qué cambió, cuándo y quién lo cambió

**¿Por qué lo usamos?**  
Porque el código de StudyBoard está guardado en GitHub, y necesitamos Git para descargarlo.

**Analogía:** Git es como Google Drive, pero especializado para código. Te permite descargar proyectos, ver su historia y colaborar con otros.

---

### TypeScript

**¿Qué es?**  
TypeScript es **JavaScript con superpoderes**. Agrega "tipos" al código para evitar errores.

**Ejemplo:**
```javascript
// JavaScript (sin tipos)
let edad = "25"; // ¿Es texto o número? 🤔
edad = edad + 1; // Resultado: "251" ❌

// TypeScript (con tipos)
let edad: number = 25; // Especificamos que es número
edad = "25"; // ERROR: no puedes poner texto ❌
edad = edad + 1; // Resultado: 26 ✅
```

**¿Por qué lo usamos?**  
Porque detecta errores antes de ejecutar el código, ahorrando tiempo de desarrollo.

---

### Angular

**¿Qué es?**  
Angular es un **framework de frontend** para construir aplicaciones web.

**¿Para qué sirve?**  
Crear la parte visual de StudyBoard: botones, formularios, tablas, navegación.

**¿Por qué lo usamos?**  
Porque es muy completo, tiene excelentes herramientas y es usado por empresas grandes (Google lo creó).

**Analogía:** Angular es como un kit de LEGO especializado. En lugar de construir cada pieza desde cero, Angular te da bloques pre-hechos (componentes) que puedes ensamblar.

---

### NestJS

**¿Qué es?**  
NestJS es un **framework de backend** para construir APIs (servidores).

**¿Para qué sirve?**  
Manejar la lógica del servidor:
- Guardar datos en la base de datos
- Validar usuarios (autenticación)
- Procesar peticiones del frontend

**¿Por qué lo usamos?**  
Porque tiene una estructura organizada y es fácil de escalar.

**Analogía:** Si Angular es la "cara" de StudyBoard (lo que ves), NestJS es el "cerebro" (lo que procesa información).

---

### SQLite

**¿Qué es?**  
SQLite es una **base de datos** ultra ligera que se guarda en un solo archivo.

**¿Para qué sirve?**  
Guardar toda tu información:
- Usuarios y contraseñas
- Materias, tareas, calificaciones
- Horarios, temarios, documentos

**¿Por qué la usamos?**  
Porque es simple, no necesita instalación aparte (viene incluida con Node.js) y es perfecta para proyectos pequeños-medianos.

**Analogía:** SQLite es como un archivo de Excel muy inteligente que organiza datos en tablas y permite buscar rápidamente.

---

### PrimeNG

**¿Qué es?**  
PrimeNG es una **librería de componentes UI** para Angular.

**¿Para qué sirve?**  
Proporciona componentes visuales bonitos y funcionales:
- Tablas, botones, formularios
- Calendarios, dropdowns, diálogos
- Gráficas, menús, notificaciones

**¿Por qué la usamos?**  
Para no tener que diseñar cada botón o tabla desde cero. PrimeNG ya tiene todo hecho y probado.

**Analogía:** PrimeNG es como usar plantillas de PowerPoint en lugar de diseñar cada diapositiva desde cero.

---

## Paso 1: Instalar Node.js

### 1.1 Descargar Node.js

1. Abre tu navegador y ve a: **https://nodejs.org**
2. Verás dos versiones:
   - **LTS (Recomendado)** ← **Descarga esta**
   - Current (Última versión)

![Página de descarga de Node.js]

3. Haz clic en el botón **LTS** (por ejemplo: "20.12.0 LTS")
4. Se descargará un archivo instalador:
   - Windows: `node-v20.12.0-x64.msi`
   - Mac: `node-v20.12.0.pkg`
   - Linux: Instrucciones en la página

### 1.2 Instalar Node.js

**Windows:**
1. Abre el archivo `.msi` descargado
2. Haz clic en "Next" varias veces
3. Acepta los términos y condiciones
4. **Importante:** Marca la casilla "Automatically install necessary tools"
5. Haz clic en "Install"
6. Espera a que termine (puede tardar 5-10 minutos)

**Mac:**
1. Abre el archivo `.pkg`
2. Sigue las instrucciones del instalador
3. Puede pedir tu contraseña de administrador

**Linux (Ubuntu/Debian):**
```bash
# Actualizar el sistema
sudo apt update

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 1.3 Verificar la Instalación

1. Abre la **terminal** (o Command Prompt en Windows):
   - Windows: Presiona `Windows + R`, escribe `cmd` y Enter
   - Mac: Presiona `Cmd + Espacio`, escribe `Terminal` y Enter
   - Linux: Presiona `Ctrl + Alt + T`

2. Escribe este comando y presiona Enter:
   ```bash
   node --version
   ```

3. Deberías ver algo como:
   ```
   v20.12.0
   ```

4. Ahora verifica **npm** (viene incluido con Node.js):
   ```bash
   npm --version
   ```

5. Deberías ver algo como:
   ```
   10.5.0
   ```

✅ **Si ves los números de versión, Node.js está instalado correctamente.**

---

## Paso 2: Instalar Git

### 2.1 Descargar Git

1. Ve a: **https://git-scm.com/downloads**
2. Haz clic en tu sistema operativo (Windows, Mac o Linux)
3. Descarga el instalador

### 2.2 Instalar Git

**Windows:**
1. Abre el archivo descargado
2. Haz clic en "Next" en todas las pantallas (configuración por defecto está bien)
3. **Importante en la pantalla "Adjusting your PATH environment":**
   - Selecciona: **"Git from the command line and also from 3rd-party software"**
4. Continúa con "Next" hasta terminar

**Mac:**
Git ya viene instalado. Si no, usa Homebrew:
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

### 2.3 Verificar la Instalación

En la terminal, ejecuta:
```bash
git --version
```

Deberías ver algo como:
```
git version 2.43.0
```

### 2.4 Configurar Git (Primera vez)

Necesitas decirle a Git quién eres:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@ejemplo.com"
```

Cambia "Tu Nombre" y el email por tus datos reales.

---

## Paso 3: Instalar un Editor de Código

Recomendamos **Visual Studio Code (VS Code)** porque es:
- Gratis y open source
- Ligero y rápido
- Tiene extensiones para todo
- Es el más usado por desarrolladores

### 3.1 Descargar VS Code

1. Ve a: **https://code.visualstudio.com**
2. Haz clic en "Download for [Tu Sistema]"
3. Espera a que descargue

### 3.2 Instalar VS Code

**Windows:**
1. Abre el archivo `.exe`
2. Acepta términos y haz clic en "Next"
3. **Importante:** Marca estas opciones:
   - ✅ Add "Open with Code" action to Windows Explorer file context menu
   - ✅ Add "Open with Code" action to Windows Explorer directory context menu
   - ✅ Add to PATH
4. Haz clic en "Install"

**Mac:**
1. Abre el archivo `.dmg`
2. Arrastra VS Code a la carpeta "Applications"

**Linux:**
```bash
sudo snap install --classic code
```

### 3.3 Extensiones Recomendadas

Abre VS Code y ve a la sección de extensiones (icono de cuadrados en la barra lateral izquierda) e instala:

1. **Angular Language Service** — Autocompletado para Angular
2. **TypeScript Import Sorter** — Organiza imports automáticamente
3. **Prettier** — Formatea tu código automáticamente
4. **GitLens** — Mejora Git en VS Code
5. **Material Icon Theme** — Iconos bonitos para archivos

---

## Paso 4: Descargar StudyBoard

### 4.1 Crear una Carpeta para Proyectos

Antes de descargar, crea una carpeta donde guardarás tus proyectos.

**Ubicación recomendada:**
- Windows: `C:\Users\TuNombre\Proyectos`
- Mac/Linux: `~/Proyectos`

### 4.2 Clonar el Repositorio

1. Abre la terminal
2. Navega a tu carpeta de proyectos:
   ```bash
   cd C:\Users\TuNombre\Proyectos
   # o en Mac/Linux:
   # cd ~/Proyectos
   ```

3. Clona StudyBoard:
   ```bash
   git clone https://github.com/Vicman3x3/studyboard.git
   ```

4. Espera a que descargue (puede tardar 1-2 minutos)

5. Entra a la carpeta:
   ```bash
   cd studyboard
   ```

### 4.3 Estructura del Proyecto

Ahora tienes StudyBoard en tu computadora. La estructura es:

```
studyboard/
├── backend/          ← Servidor (NestJS)
├── frontend/         ← Aplicación web (Angular)
├── docs/             ← Documentación
└── README.md         ← Información del proyecto
```

---

## Paso 5: Configurar el Backend

El backend es el servidor que maneja la base de datos y la lógica del negocio.

### 5.1 Instalar Dependencias del Backend

1. En la terminal, navega al backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias (librerías que necesita el proyecto):
   ```bash
   npm install
   ```

   **¿Qué hace este comando?**  
   Lee el archivo `package.json` y descarga todas las librerías que StudyBoard necesita (NestJS, TypeORM, bcrypt, etc.)

   **Tiempo estimado:** 2-5 minutos

3. Deberías ver una carpeta nueva llamada `node_modules/` con miles de archivos. **No te asustes, es normal**.

### 5.2 Crear el Archivo .env

El archivo `.env` guarda información sensible (como contraseñas y secretos).

1. En la carpeta `backend/`, crea un archivo llamado `.env`

2. Copia y pega este contenido:

   ```env
   # JWT (Autenticación)
   JWT_SECRET=mi_super_secreto_cambiar_en_produccion_12345
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Base de datos
   DATABASE_PATH=./studyboard.sqlite

   # Puerto del servidor
   PORT=3000
   ```

3. Guarda el archivo

**Explicación de las variables:**

- `JWT_SECRET`: Clave secreta para generar tokens de autenticación (cámbiala por algo único)
- `JWT_EXPIRES_IN`: Tiempo de vida del token de acceso (1 hora)
- `JWT_REFRESH_EXPIRES_IN`: Tiempo de vida del token de refresco (7 días)
- `DATABASE_PATH`: Ubicación del archivo de la base de datos SQLite
- `PORT`: Puerto donde correrá el servidor (3000 por defecto)

### 5.3 Ejecutar el Backend (Primera vez)

1. En la terminal (aún en la carpeta `backend/`):
   ```bash
   npm run start:dev
   ```

   **¿Qué hace este comando?**  
   - Compila el código TypeScript a JavaScript
   - Inicia el servidor NestJS
   - Activa el "modo desarrollo" (se reinicia automáticamente al hacer cambios)

2. Espera a que veas algo como:
   ```
   [Nest] 12345  - 05/17/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
   [Nest] 12345  - 05/17/2026, 10:30:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
   ...
   🚀 StudyBoard API running on http://localhost:3000/api
   ```

3. ✅ **Si ves el mensaje del cohete, el backend está funcionando.**

4. **¡No cierres esta terminal!** Déjala abierta. El servidor debe seguir corriendo.

### 5.4 Verificar que el Backend Funciona

1. Abre tu navegador
2. Ve a: **http://localhost:3000/api**
3. Deberías ver un mensaje JSON como:
   ```json
   {
     "message": "StudyBoard API is running",
     "version": "1.0.0"
   }
   ```

✅ **Si ves esto, el backend está listo.**

---

## Paso 6: Configurar el Frontend

El frontend es la aplicación web que verás en el navegador.

### 6.1 Abrir una Nueva Terminal

Como el backend debe seguir corriendo, necesitas otra terminal:

- **VS Code:** Presiona `Ctrl + Shift + ñ` (o `Terminal > New Terminal` en el menú)
- **O abre otra ventana de terminal** desde tu sistema

### 6.2 Instalar Dependencias del Frontend

1. Navega a la carpeta frontend:
   ```bash
   cd frontend
   # Si abriste otra terminal desde la raíz:
   # cd C:\Users\TuNombre\Proyectos\studyboard\frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

   **Tiempo estimado:** 3-7 minutos

3. Espera a que termine. Verás que se crea otra carpeta `node_modules/` (mucho más grande que la del backend).

### 6.3 Crear el Archivo de Environment

1. En `frontend/src/`, ya existe una carpeta `environments/`
2. Verifica que el archivo `environment.ts` tenga esto:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000',
   };
   ```

   Si no existe, créalo con ese contenido.

### 6.4 Ejecutar el Frontend

1. En la terminal del frontend:
   ```bash
   npm run start
   # o también puedes usar:
   # ng serve
   ```

   **¿Qué hace este comando?**  
   - Compila la aplicación Angular
   - Inicia un servidor de desarrollo
   - Abre el navegador automáticamente (a veces)

2. Espera a que compile. Verás algo como:
   ```
   ✔ Browser application bundle generation complete.
   Initial Chunk Files   | Names         | Size
   vendor.js             | vendor        | 2.5 MB
   main.js               | main          | 500 KB
   ...
   
   Application bundle generation complete. [10.234 seconds]
   
   Watch mode enabled. Watching for file changes...
   ➜  Local:   http://localhost:4200/
   ➜  Network: http://192.168.1.10:4200/
   ```

3. ✅ **Si ves "Application bundle generation complete", está listo.**

4. **Tampoco cierres esta terminal.** El frontend debe seguir corriendo.

---

## Paso 7: Ejecutar StudyBoard

### 7.1 Abrir StudyBoard en el Navegador

1. Abre tu navegador (Chrome, Firefox, Edge)
2. Ve a: **http://localhost:4200**

**Deberías ver la pantalla de login de StudyBoard.**

### 7.2 Crear tu Primera Cuenta

1. Haz clic en **"Registrarse"** (o "Register")
2. Llena el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: Algo seguro (mínimo 8 caracteres)
3. Haz clic en **"Registrarse"**

4. Si todo salió bien:
   - Te redirigirá automáticamente al Dashboard
   - Verás la pantalla de inicio con tarjetas vacías (aún no tienes datos)

### 7.3 Probar las Funcionalidades

**Prueba 1: Crear un Semestre**
1. Ve a **Semestres** en el menú
2. Haz clic en "Agregar Semestre"
3. Llena el formulario y guarda
4. ✅ Deberías ver el semestre en la lista

**Prueba 2: Crear una Materia**
1. Activa el semestre que creaste
2. Ve a **Materias**
3. Haz clic en "Agregar Materia"
4. Elige un color y guarda
5. ✅ Deberías ver la materia con el color elegido

**Prueba 3: Crear una Tarea**
1. Ve a **Tablero**
2. Haz clic en "Nueva Tarea"
3. Llena el formulario
4. ✅ Debería aparecer en la columna "Pendiente"

**Prueba 4: Arrastrar una Tarea**
1. Haz clic en la tarea y manténla presionada
2. Arrástrala a "En Progreso"
3. ✅ Debería moverse

**Si las 4 pruebas funcionan, ¡StudyBoard está correctamente instalado!** 🎉

---

## Resumen de Comandos

### Backend (Terminal 1)
```bash
cd backend
npm install                    # Solo la primera vez
npm run start:dev              # Cada vez que quieras usarlo
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install                    # Solo la primera vez
npm run start                  # Cada vez que quieras usarlo
```

### URLs Importantes
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api

---

## Solución de Problemas

### Error: "node is not recognized as an internal or external command"

**Problema:** Node.js no está en el PATH de tu sistema.

**Solución:**
1. Reinstala Node.js
2. Durante la instalación, marca la opción "Add to PATH"
3. Reinicia tu terminal

### Error: "npm ERR! code EACCES" (Mac/Linux)

**Problema:** Permisos de escritura.

**Solución:**
```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

### Error: "Port 3000 is already in use"

**Problema:** Otro programa está usando el puerto 3000.

**Solución:**
1. Cierra otros programas que puedan usar ese puerto
2. O cambia el puerto en `backend/.env`:
   ```env
   PORT=3001
   ```
3. Y actualiza `frontend/src/environments/environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:3001'
   ```

### Error: "Cannot find module '@angular/...'"

**Problema:** Dependencias del frontend no instaladas correctamente.

**Solución:**
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### Error: "CORS policy"

**Problema:** El backend no permite peticiones del frontend.

**Solución:**
Verifica que en `backend/src/main.ts` esté esto:
```typescript
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});
```

### El frontend no compila

**Solución 1 - Limpiar caché:**
```bash
cd frontend
npm run clean        # Si existe este script
npm install
npm run start
```

**Solución 2 - Verificar versión de Node:**
```bash
node --version
```
Debe ser v18.x o v20.x. Si es menor, actualiza Node.js.

### Base de datos corrupta

**Síntoma:** Errores al crear usuarios o guardar datos.

**Solución:**
1. Cierra el backend
2. Elimina el archivo `backend/studyboard.sqlite`
3. Reinicia el backend
4. TypeORM recreará la base de datos vacía
5. Regístrate de nuevo

### El navegador muestra página en blanco

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Lee los errores (probablemente el backend no está corriendo)
4. Asegúrate de que **ambos** (backend y frontend) estén corriendo

---

## Siguientes Pasos

Ahora que tienes StudyBoard funcionando:

1. **Lee el Manual de Usuario** (`03-manual-usuario.md`) para aprender a usar todas las funcionalidades
2. **Explora el código** abre el proyecto en VS Code y navega por los archivos
3. **Haz cambios** — edita algo y mira cómo se actualiza automáticamente
4. **Aprende** — este proyecto es excelente para entender Angular, NestJS, TypeORM y más

---

## Recursos Adicionales

### Documentación Oficial
- **Node.js:** https://nodejs.org/docs
- **Angular:** https://angular.dev
- **NestJS:** https://docs.nestjs.com
- **TypeScript:** https://www.typescriptlang.org/docs
- **PrimeNG:** https://primeng.org

### Tutoriales Recomendados
- **Angular para principiantes:** https://angular.dev/tutorials
- **Git en 15 minutos:** https://try.github.io
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html

---

**¡Felicidades!** Has instalado exitosamente StudyBoard.

Si tienes problemas, revisa la sección de [Solución de Problemas](#solución-de-problemas) o busca ayuda en los issues de GitHub.

**Autor:** Taller "Akuma no Code"  
**Versión:** 1.0  
**Fecha:** Mayo 2026

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

