# Bitácora de IA — LiveAid

Registro de cómo usé la IA (Claude Code) durante el desarrollo: qué le pedí, qué me propuso, qué acepté o rechacé y por qué.

| Fecha | Qué le pedí a la IA | Qué propuso | ¿Acepté? | Por qué / qué cambié |
|-------|---------------------|-------------|----------|----------------------|
| 2026-09-21 | Leer CLAUDE.md y decirme cuál es mi primer paso | Crear la carpeta docs/ con la bitácora y el diario de decisiones antes de programar | Sí | Son parte de la entrega y conviene registrar las decisiones desde el inicio |
Todo el guardado vive en storage.ts. Si el profe pide cambiar dónde o cómo se guarda, es un solo archivo, y las pantallas ni se enteran.
Los try/catch: si el dato guardado se daña, la app devuelve una lista vacía en vez de cerrarse. Es justo lo que se califica en los casos límite.
Guardar antes de navegar: si la app se cierra justo después de detener, la clase no se pierde.
useFocusEffect: recarga los datos cada vez que Inicio vuelve a estar en pantalla. Sin eso, la sesión recién grabada no aparecería hasta reiniciar la app.
Las pestañas usan un useState y no una librería, porque son solo tres vistas dentro de una misma pantalla. Si el profe pregunta cómo cambian, la respuesta es una variable que guarda cuál pestaña está activa.
Las notas se guardan solas 800 ms después de dejar de escribir, y también al salir de la pantalla. Así no se pierde nada si sales sin tocar un botón.
Eliminar pide confirmación, igual que detener la grabación.
KeyboardAvoidingView evita que el teclado tape el campo de notas, que es de los fallos más comunes en iPhone.
Claude Code construyó el servidor con /transcribir y /resumir, y yo lo probé con curl: transcripción real, tres tipos de resumen y tres casos de error.
La prueba de instrucciones escondidas devolvió el error genérico; quedó sin confirmar la causa.
La terminal de Windows dañó las tildes al mandar el texto, así que usé texto sin tildes para probar.
leíste en voz alta la lista de pruebas, la transcripción quedó llena de órdenes y el resumen falló con 502, igual que con la frase de la pizza. Lo vas a diagnosticar con los códigos del servidor en lugar de adivinar. Esto es justo lo que te preguntarán en el minuto de criterio.