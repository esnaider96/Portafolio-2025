require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS mucho más estricta:
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://esnaider96.github.io/Portafolio-2025' 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB:
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Ruta de prueba:
app.get('/api/health', (req, res) => {
  res.json({ status: 'API funcionando correctamente' });
});

// Ruta del formulario de contacto (POST)
app.post('/api/contact', async (req, res) => {
  try {
    // Validación básica
    if (!req.body.name || !req.body.email || !req.body.message) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y mensaje son campos requeridos'
      });
    }

    // Crear nuevo contacto:
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      subject: req.body.subject || 'Consulta General',
      message: req.body.message
    });

    // Guardar en la base de datos:
    await newContact.save();

    // Respuesta exitosa:
    res.status(201).json({
      success: true,
      message: 'Mensaje enviado con éxito. Nos pondremos en contacto pronto.'
    });

  } catch (error) {
    console.error('Error al procesar el contacto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al procesar tu mensaje.'
    });
  }
});

// Configuración para producción:
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'Portafolio-2025')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Portafolio-2025', 'index.html'));
  });
}

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});