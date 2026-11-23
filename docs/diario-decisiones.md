# Diario de decisiones: LiveAid
 
Cada entrada dice qué decidí, por qué y qué descarté. Las fechas son de noviembre de 2026.
 
## 1. App móvil con Expo (React Native + TypeScript)
**Decisión:** hacer LiveAid con Expo y TypeScript.
**Por qué:** es lo que vimos en la materia, puedo probar directo en mi iPhone con Expo Go y es una tecnología que ya uso en otros proyectos.
 
## 2. Expo Router en lugar de dejar `App.tsx`
**Decisión:** navegar con Expo Router, donde cada archivo de `app/` es una pantalla.
**Por qué:** la navegación no es el centro del proyecto. Dejar `App.tsx` implicaba construir a mano la barra de pestañas, el botón "atrás" y el paso de datos entre pantallas. Con Expo Router sé en qué archivo está cada pantalla, que es lo que me van a pedir en la presentación.
**Descarté:** React Navigation y construir la navegación a mano.
 
## 3. Servidor intermediario para las llaves
**Decisión:** un servidor Node.js (Express) en `server/` recibe el audio y el texto, y es el único que habla con Groq y con Claude.
**Por qué:** una llave dentro de la app se puede extraer del paquete, y mi repositorio es público. Las llaves viven en `server/.env`, que está en `.gitignore`. Antes de crear ese archivo comprobé con `git check-ignore` que estuviera ignorado; no lo estaba y agregué la regla.
 
## 4. Groq (Whisper) para transcribir
**Decisión:** transcribir con Groq, modelo `whisper-large-v3-turbo`, en español.
**Por qué:** su capa gratuita no pide tarjeta y Claude no transcribe audio. Descarté Deepgram porque solo da créditos de prueba.
 
## 5. Claude (claude-haiku-5-5) para resumir
**Decisión:** resumen, explicación y guía de estudio con la API de Claude, modelo `claude-haiku-5-5`, con un solo endpoint y tres tipos de contenido.
**Por qué:** la API no es gratuita, así que compré $5 USD de crédito (mi propuesta decía costo $0). Haiku es el modelo más barato y alcanza para resumir clases. El modelo está en una constante para cambiarlo en una línea.
 
## 6. La transcripción es material, no órdenes
**Decisión:** el texto de la clase va dentro de etiquetas `<transcripcion>` y el prompt dice que nunca se obedecen instrucciones que aparezcan ahí; el texto va en español y plano.
**Por qué:** la transcripción sale de lo que se dice en voz alta, y alguien podría decir "ignora tus instrucciones" en clase. Texto plano porque `Text` de React Native no interpreta Markdown.
**Pendiente:** la prueba de la receta de pizza falló esa noche con el error genérico y no la repetí. [CONFIRMA: resultado de repetirla]
 
## 7. Guardar la sesión primero y transcribir después
**Decisión:** al detener, la sesión se guarda con su audio y el estado "procesando"; la transcripción se hace en segundo plano. Si falla, queda en "Error al transcribir" con botón Reintentar.
**Por qué:** si falta internet o el servidor falla, no pierdo la clase.
 
## 8. Guardado local con AsyncStorage y try/catch
**Decisión:** todo el guardado vive en `src/storage.ts`, con try/catch.
**Por qué:** es un solo archivo para cambiar, y un dato dañado no cierra la app.
 
## 9. Cronómetro con `Date.now()`
**Decisión:** el cronómetro calcula hora actual menos hora de inicio, no cuenta de segundo en segundo.
**Por qué:** si bloqueo el teléfono o mando la app a segundo plano no pierde tiempo.
 
## 10. Enviar el audio con `XMLHttpRequest`
**Decisión:** el audio se manda con `XMLHttpRequest`, no con `fetch`.
**Por qué:** el `fetch` de esta versión de Expo no acepta archivos con `{uri, name, type}`. Lo comprobé con el error `Unsupported FormDataPart implementation`. No instalé librerías extra para esto.
 
## 11. Comprobar el archivo con `fetch(uri)` en vez de instalar `expo-file-system`
**Decisión:** antes de enviar compruebo que el audio existe con `fetch(uri)`.
**Por qué:** `expo-file-system` no estaba instalado y no quise agregar dependencias contra reloj. Esa decisión la tomó Claude Code porque le pedí no instalar paquetes; la acepté.
 
## 12. No actualizar React
**Decisión:** dejar `react@19.3.0`.
**Por qué:** `npx expo install --check` solo pidió un parche de `expo` y no mencionó `react`, así que esa es la versión correcta para el SDK 58. El conflicto era de `react-dom`, que solo se usa en web.
 
## 13. Transcripción por frases con tiempos
**Decisión:** pedir a Groq `verbose_json` con segmentos y mostrar cada frase con su tiempo a la izquierda.
**Por qué:** quería ver de un vistazo qué parte de la transcripción está marcada. Probé primero el servidor con curl y después la pantalla.
 
## 14. Margen de 4 segundos para los marcadores
**Decisión:** un marcador resalta la frase que se decía 4 segundos antes (`MARGEN_ATRAS_SEG = 4` en `src/marcadores.ts`).
**Por qué:** uno toca MARCAR después de oír algo importante, no justo cuando lo dicen. Con frases de unos 8 segundos, a veces se resalta la frase anterior a la que esperaba. [CONFIRMA: si lo dejas en 4 o lo bajas a 2]
 
## 15. Los marcadores le dan prioridad al resumen
**Decisión:** la app manda al servidor las frases marcadas ("destacados") y el prompt les da prioridad.
**Por qué:** para que los marcadores sirvan para algo más que mostrar una lista.
 
## 16. Materias
**Decisión:** crear materias, elegir una al iniciar la sesión y ver las sesiones de cada una; solo se puede eliminar una materia sin sesiones.
**Por qué:** todas las grabaciones decían "Cálculo Diferencial e Integral" y no es mi única clase. No se pierde una clase por borrar una materia. [CONFIRMA: que quedó funcionando]
 
## 17. Orientación vertical
**Decisión:** dejar la app solo en vertical.
**Por qué:** en clase el celular se usa apoyado en la mesa y el diseño está pensado para esa orientación. Girarlo no cierra ni congela la app, y habilitar horizontal obligaba a revisar cada pantalla.
 
## 18. Entrega por Expo Go (sin APK)
**Decisión:** quitar el APK de Android del plan.
**Por qué:** tengo iPhone. Quedó pendiente confirmar qué acepta el profesor como liga para abrir la app. [CONFIRMA: respuesta del profesor y la liga final]
 