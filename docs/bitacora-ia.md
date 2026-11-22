# Bitácora de IA — LiveAid

Registro de cómo usé la IA (Claude Code) durante el desarrollo: qué le pedí, qué me propuso, qué acepté o rechacé y por qué.

| Fecha | Qué le pedí a la IA | Qué propuso | ¿Acepté? | Por qué / qué cambié |
|-------|---------------------|-------------|----------|----------------------|
| 2026-09-21 | Leer CLAUDE.md y decirme cuál es mi primer paso | Crear la carpeta docs/ con la bitácora y el diario de decisiones antes de programar | Sí | Son parte de la entrega y conviene registrar las decisiones desde el inicio |
Todo el guardado vive en storage.ts. Si el profe pide cambiar dónde o cómo se guarda, es un solo archivo, y las pantallas ni se enteran.
Los try/catch: si el dato guardado se daña, la app devuelve una lista vacía en vez de cerrarse. Es justo lo que se califica en los casos límite.
Guardar antes de navegar: si la app se cierra justo después de detener, la clase no se pierde.
useFocusEffect: recarga los datos cada vez que Inicio vuelve a estar en pantalla. Sin eso, la sesión recién grabada no aparecería hasta reiniciar la app.