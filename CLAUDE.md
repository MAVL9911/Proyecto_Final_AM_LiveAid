# LiveAid (Proyecto_Final_AM_LiveAid)

App móvil hecha con Expo (React Native + TypeScript) para estudiantes. Transcribe clases en vivo con el micrófono del celular, guarda la transcripción y usa IA (API de Claude) para generar un resumen simple, una explicación del contenido o una guía de estudio.

Proyecto final de la materia Aplicaciones Móviles (UABC, FIAD). Desarrollo individual.

## Idioma y forma de trabajo
- Responde siempre en español.
- Trabaja paso a paso y pide confirmación antes de pasar al siguiente paso.
- Explica DESPUÉS de hacer cada cambio, no antes.
- Al modificar un archivo, entrégalo completo, no fragmentos sueltos.
- Después de cada cambio dime en qué archivo quedó y qué hace, porque en la presentación debo explicar el código y modificarlo yo.
- Prefiere soluciones simples que yo pueda dominar sobre soluciones sofisticadas.

## Alcance (MVP, tiempo muy limitado)
Flujo principal: registrar/abrir clase -> grabar audio -> transcribir -> guardar -> botón "Resumir con IA".
Después, si hay tiempo: explicación del contenido y guía de estudio.
Fuera de alcance: login complejo, colaboración, modo offline completo, múltiples oradores.

## Decisiones técnicas
- Transcripción: API externa (Whisper o Google Speech-to-Text), aún por decidir.
- IA: API de Claude (Anthropic).
- La llave de API NUNCA va dentro de la app ni se sube a GitHub. Se usará un backend pequeño (Node.js) como intermediario. Las llaves van en variables de entorno y en .env (que debe estar en .gitignore).
- Presupuesto: solo créditos gratuitos/trial.

## Reglas de la entrega (Classroom)
Se entrega: liga del repo, liga para abrir la app (Expo/Snack) o APK, y bitácora de IA + diario de decisiones dentro del repo (carpeta docs/: bitacora-ia.md y diario-decisiones.md).
Se califica el último commit antes de la fecha límite.
Haz commits pequeños e incrementales con mensajes claros.

## Presentación (8 min)
1. Demo del flujo principal (3 min) + un caso límite que pida el profesor.
2. Cambio en vivo con IA (4 min): debo decir en qué archivo va el cambio y revisar y probar lo que la IA devuelva.
3. Pregunta sobre la bitácora (1 min).

## Casos límite que la app debe soportar sin cerrarse ni mostrar pantalla roja
Sin internet, campos vacíos, doble toque en guardar, permiso de micrófono negado, lista vacía, rotar pantalla, salir y volver a entrar (datos conservados), texto muy largo.
Siempre mostrar un mensaje claro de error o impedir la acción.

## Bitácora de IA
Cuando propongas algo importante o algo que yo rechace, recuérdame anotarlo en docs/bitacora-ia.md y docs/diario-decisiones.md.