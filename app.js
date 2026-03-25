const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Middleware para subida de archivos
app.use(fileUpload());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Endpoint para subir avatar
app.post('/upload/avatar/:userId', (req, res) => {
  // Verificar si se envió un archivo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.avatar) {
    return res.status(400).json({
      error: 'No se ha enviado ningún archivo avatar'
    });
  }

  const avatar = req.files.avatar;
  const { userId } = req.params;

  // Obtener extensión
  const extension = avatar.name.split('.').pop().toLowerCase();

  // Extensiones permitidas
  const extensionesPermitidas = ['png', 'jpg', 'jpeg', 'gif'];

  if (!extensionesPermitidas.includes(extension)) {
    return res.status(400).json({
      error: 'Extensión de archivo no permitida'
    });
  }

  // Crear nombre del archivo
  const nombreArchivo = `${userId}.${extension}`;

  // Ruta de destino
  const rutaDestino = path.join(__dirname, 'uploads', 'avatars', nombreArchivo);

  // Mover archivo
  avatar.mv(rutaDestino, (err) => {
    if (err) {
      return res.status(500).json({
        error: 'Error al guardar el archivo'
      });
    }

    res.status(200).json({
      mensaje: 'Avatar subido exitosamente!',
      archivo: nombreArchivo
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});