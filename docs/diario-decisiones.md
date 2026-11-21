# Diario de decisiones — LiveAid

Decisiones técnicas importantes del proyecto, con sus alternativas y el motivo de la elección.

## 2026-11-20 — Tecnologías base

- **Decisión:** Expo (React Native + TypeScript) para la app.
  - **Por qué:** se puede probar rápido en el celular con Expo Go y compartir por Expo/Snack o APK.
- **Decisión:** API de Claude (Anthropic) para resumir, explicar y generar la guía de estudio.
- **Decisión:** usar un backend pequeño en Node.js como intermediario.
  - **Por qué:** la llave de API nunca debe ir dentro de la app ni subirse a GitHub. Las llaves van en variables de entorno / `.env` (incluido en `.gitignore`).
- **Pendiente:** elegir la API de transcripción (Whisper o Google Speech-to-Text).
- **Restricción:** solo créditos gratuitos/trial.

## 2026-11-20 — Alcance (MVP)

- **Flujo principal:** registrar/abrir clase → grabar audio → transcribir → guardar → "Resumir con IA".
- **Fuera de alcance:** login complejo, colaboración, modo offline completo, múltiples oradores.
- **Por qué:** el tiempo es muy limitado y es mejor un flujo principal sólido que muchas funciones a medias.
