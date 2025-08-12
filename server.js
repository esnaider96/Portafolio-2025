require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB Atlas:
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado a MongoDB Atlas - Cluster0'))
.catch(err => console.error('Error de conexión con MongoDB:', err));

// Con Middleware:
app.use(cors());
app.use(express.json());

// Ruta para manejar el formulario de contacto:
app.post('/api/contact', async (req, res) => {
    try {
    res.json({ success: true, message: "MMensaje enviado con éxito, gracias por tu comunicación." });
  }    catch (error) {
       res.status(500).json({ error: error.message });
  }
});

// Faltan campos importantes, por favor revisa de nuevo.'

if (process.env.NODE_ENV === 'production') {
    // Aquí coloco los archivos estáticos:
    app.use(express.static(path.join(__dirname, 'Portafolio-2025')));
    
    // Manejar SPA:
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'Portafolio-2025', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// La ruta de prueba:
app.get('/', (req, res) => {
    res.send('API de MONTEBYTES funcionando');
});