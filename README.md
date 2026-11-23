# LiveAid

App móvil para estudiantes: graba la clase desde el celular, la transcribe, permite marcar los momentos importantes y genera resumen, explicación y guía de estudio con IA.

Proyecto final de Aplicaciones Móviles, UABC FIAD. Desarrollo individual.

## Probar la app (iPhone)

1. Instala **Expo Go** desde la App Store.
2. Abre esta liga en el iPhone y toca **Open** junto a Expo Go:
   https://expo.dev/preview/update?message=entrega+final&updateRuntimeVersion=1.0.0&createdAt=2026-11-23T01%3A16%3A25.096Z&slug=exp&projectId=22ccb5d4-ab5a-4cfd-b756-4ee04c38ea52&group=2b267939-e17d-458c-8309-9c76f296627e
3. Alternativa directa desde el celular: `exp://u.expo.dev/22ccb5d4-ab5a-4cfd-b756-4ee04c38ea52/group/2b267939-e17d-458c-8309-9c76f296627e`

**Importante:** el servidor corre en un plan gratuito de Render y se duerme tras 15 minutos sin uso. La primera transcripción o resumen puede tardar hasta un minuto. La app lo despierta al abrirse.

## Qué hace

- Grabar una clase con cronómetro, pausa y botón **MARCAR** para señalar momentos clave.
- Transcribir el audio en español (Groq, Whisper) con el tiempo de cada frase; las frases marcadas se resaltan.
- Generar **resumen**, **explicación** y **guía de estudio** con Claude, dando prioridad a lo marcado.
- Organizar las sesiones por materia, escribir notas con autoguardado y conservar todo en el teléfono.
- Mensajes claros ante errores (sin internet, permiso de micrófono, servidor no disponible) sin cerrar la app.

## Tecnología

- App: Expo (SDK 58), React Native, TypeScript, Expo Router, expo-audio, AsyncStorage.
- Servidor (`server/`): Node.js + Express. Intermediario que guarda las llaves de API (Groq y Anthropic) para que nunca estén en la app ni en el repositorio. Protegido con una clave de aplicación y límite de peticiones por IP.
- Transcripción: Groq `whisper-large-v3-turbo`. Resumen: `claude-haiku-5-5`.

## Estructura

```
app/        pantallas (Expo Router, un archivo por pantalla)
src/        tema, almacenamiento, llamadas al servidor, componentes
server/     servidor Node.js (llaves de API solo en variables de entorno)
docs/       bitacora-ia.md y diario-decisiones.md
```

## Correrlo en local

```
npm install
npx expo start
```

La app usa por defecto el servidor publicado. Para usar uno local, define `EXPO_PUBLIC_API_URL` en un `.env` de la raíz. Se necesita también `EXPO_PUBLIC_APP_KEY`, que debe coincidir con `APP_KEY` del servidor (ver `server/.env.example`).

## Documentación del uso de IA

- [Bitácora de IA](docs/bitacora-ia.md)
- [Diario de decisiones](docs/diario-decisiones.md)
