require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Sin la llave de Groq el servidor no sirve: avisamos y salimos.
if (!process.env.GROQ_API_KEY) {
  console.error(
    'Falta la variable GROQ_API_KEY. Agrégala en server/.env (puedes copiar server/.env.example) y vuelve a iniciar el servidor.'
  );
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

const app = express();
app.use(cors());

// El audio se guarda en memoria (no en disco), máximo 10 MB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get('/salud', (req, res) => {
  res.json({ ok: true });
});

app.post('/transcribir', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: 'No se recibió ningún archivo de audio en el campo "audio".' });
  }

  // Timeout de 30 segundos con AbortController.
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 30000);

  try {
    const formulario = new FormData();
    formulario.append(
      'file',
      new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/m4a' }),
      req.file.originalname || 'audio.m4a'
    );
    formulario.append('model', 'whisper-large-v3-turbo');
    formulario.append('language', 'es');
    formulario.append('response_format', 'json');

    const respuesta = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: formulario,
      signal: controlador.signal,
    });

    if (respuesta.status === 429) {
      return res
        .status(429)
        .json({ error: 'Demasiadas solicitudes, intenta de nuevo en un momento' });
    }

    if (!respuesta.ok) {
      // Solo registramos el código de estado, nunca la llave ni el audio.
      console.error('Groq respondió con error, código:', respuesta.status);
      return res.status(502).json({
        error: 'El servicio de transcripción no pudo procesar el audio. Intenta de nuevo.',
      });
    }

    const datos = await respuesta.json();
    return res.json({ texto: datos.text || '' });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Timeout al llamar a Groq (30 s)');
      return res.status(502).json({
        error: 'El servicio de transcripción tardó demasiado en responder. Intenta de nuevo.',
      });
    }
    console.error('Error al contactar a Groq:', error.name);
    return res
      .status(502)
      .json({ error: 'No se pudo conectar con el servicio de transcripción.' });
  } finally {
    clearTimeout(temporizador);
  }
});

// Errores de multer (por ejemplo, archivo mayor a 10 MB) y cualquier otro.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const mensaje =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'El audio es demasiado grande (máximo 10 MB).'
        : 'No se pudo leer el archivo de audio.';
    return res.status(400).json({ error: mensaje });
  }
  console.error('Error inesperado:', err.name);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor listo en el puerto ${PORT}`);
});
