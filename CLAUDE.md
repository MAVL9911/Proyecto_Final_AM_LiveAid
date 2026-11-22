# LiveAid (Proyecto_Final_AM_LiveAid)

App móvil hecha con Expo (React Native + TypeScript + Expo Router) para estudiantes de UABC FIAD. Graba y transcribe clases desde el celular, permite marcar momentos clave y genera resúmenes con IA (API de Claude).

Proyecto final de Aplicaciones Móviles (UABC, FIAD). Desarrollo individual.
Fecha límite: domingo 22 de noviembre de 2026, 23:59 (hora de Tijuana). Meta interna: terminar el domingo a las 20:00. Se califica el último commit antes de la fecha límite.

## Forma de trabajo (obligatoria)
- Responde siempre en español.
- Trabaja paso a paso y pide confirmación antes de pasar al siguiente paso.
- Explica DESPUÉS de hacer cada cambio, no antes.
- Al modificar un archivo, entrégalo completo, no fragmentos sueltos.
- Después de cada cambio dime en qué archivo quedó y qué hace: en la presentación debo decir en qué archivo va un cambio y modificarlo yo.
- Prefiere soluciones simples que yo pueda explicar sobre soluciones sofisticadas.
- Commits pequeños e incrementales con mensajes claros (feat:, fix:, docs:, chore:).
- No hagas commit hasta que yo confirme que la app corre.
- Cuando proponga algo importante o yo rechace una sugerencia tuya, recuérdame anotarlo en docs/bitacora-ia.md y docs/diario-decisiones.md.

## Alcance (MVP)
Prioridad alta, en este orden:
1. Navegación (pestañas inferiores) y tema visual.
2. Inicio: saludo, 4 tarjetas de estadísticas, sesiones recientes.
3. Sesión en vivo: cronómetro, ondas, botón MARCAR, pausa, detener (con confirmación).
4. Sesión guardada (pantalla de resumen) y Detalle de sesión con pestañas Resumen IA / Transcripción / Mis notas.
5. Guardado local de sesiones (AsyncStorage).
6. Grabación real + transcripción por trozos (~30 s) vía backend.
7. Resumen con Claude vía backend.
8. Login / registro con servicio externo (Firebase Auth o Supabase Auth, por decidir; no programar autenticación a mano). Va al final: si el domingo a las 14:00 no funciona, se reduce a una pantalla de perfil local y se anota en el diario de decisiones.
Después, si hay tiempo: explicación del contenido, guía de estudio, materias, reproductor de audio con marcadores en la línea de tiempo.
Fuera de alcance: Recovery Hub, colaboración, modo offline completo, varios oradores, "clases de hoy" automáticas.

## Estructura de pantallas (Expo Router, un archivo por pantalla)
```
app/
  _layout.tsx            raíz: protege rutas según sesión iniciada
  login.tsx              login / registro
  (tabs)/
    _layout.tsx          barra de pestañas inferior
    index.tsx            Inicio
    sesiones.tsx         lista de todas las sesiones
    materias.tsx         materias (media prioridad)
  en-vivo.tsx            sesión en vivo
  guardada.tsx           sesión guardada
  sesion/[id].tsx        detalle de sesión (3 pestañas)
src/
  theme.ts               colores, tipografías, espaciados
  storage.ts             leer y guardar sesiones
  api.ts                 llamadas al backend (transcribir, resumir)
  components/            tarjetas, botón MARCAR, ondas, etc.
server/                  backend Node.js + Express (llaves de API)
docs/                    bitacora-ia.md y diario-decisiones.md
```
App.tsx e index.ts ya no se usan (el punto de entrada es "expo-router/entry" en package.json).

## Diseño (tomado del prototipo web livedaid.org, valores aproximados)
- Tema oscuro. Fondo casi negro azulado (#0B0D12), tarjetas un poco más claras (#161922), bordes sutiles.
- Color principal: naranja coral (#FF7A59) para botón "Nueva sesión", MARCAR y acentos.
- Colores por materia: naranja, morado (#A855F7), azul (#3B82F6), ámbar (#F59E0B).
- Estados: verde (#22C55E) "Transcripción lista", ámbar "Procesando…", rojo (#EF4444) detener / "En vivo".
- Títulos con tipografía serif; cronómetro y horas en monoespaciada; texto en sans-serif.
- Tarjetas con esquinas muy redondeadas (~16-20 px) y una barra de color arriba en "Sesiones recientes".
- En celular: barra de pestañas inferior (Inicio, Sesiones, Materias), botón flotante "Nueva sesión". La barra espaciadora no existe: solo el botón MARCAR.
- Datos de ejemplo del prototipo: Cálculo Diferencial e Integral, Programación Orientada a Objetos, Interacción Humano-Computadora, Estadística Inferencial.

## Decisiones técnicas
- Navegación: Expo Router (cada archivo de app/ es una pantalla; (tabs) agrupa las pestañas; [id] es una pantalla que recibe un dato).
- Celular de pruebas: iPhone 17. La demo en vivo se hace con Expo Go. No se genera APK.
- Transcripción: Groq (modelo whisper-large-v3-turbo, idioma "es") por trozos de ~30 s. Claude NO transcribe audio.
- Resumen / explicación / guía: API de Claude (Anthropic) con claude-haiku-5-5.
- La llave de API NUNCA va en la app ni se sube a GitHub. Backend Node.js como intermediario, llaves en variables de entorno (server/.env), .env dentro de .gitignore.
- Presupuesto: la capa gratuita de Groq cuesta $0; la API de Claude requiere unos $5 USD de crédito prepagado.
- Idioma de las clases: español.

## Casos límite (la app no debe cerrarse ni mostrar pantalla roja)
Sin internet, campos vacíos, doble toque en guardar o detener, permiso de micrófono negado, lista vacía, rotar pantalla, salir y volver a entrar (datos conservados), texto muy largo, fallo de la API de transcripción o de Claude.
Siempre mostrar un mensaje claro, impedir la acción o recuperarse.

## Entrega (Classroom)
Liga del repo de GitHub, liga para abrir la app (Expo / Snack) y bitácora de IA + diario de decisiones dentro del repo (docs/). No se entrega APK.

## Presentación (8 min)
1. Demo del flujo principal (3 min) + un caso límite que pida el profesor.
2. Cambio en vivo con IA (4 min): digo en qué archivo va el cambio, lo pido a la IA, reviso y pruebo en la app.
3. Una pregunta sobre la bitácora (1 min).