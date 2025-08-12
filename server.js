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

// Middleware:
app.use(cors());
app.use(express.json());

// Ruta para manejar el formulario de contacto:
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // La validación básica:
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Por favor completa todos los campos requeridos' 
            });
        }

        // Crear y guardar el contacto en la base de datos:
        const newContact = new Contact({
            name,
            email,
            phone: phone || '',
            subject,
            message
        });

        await newContact.save();

        res.json({ 
            success: true, 
            message: "Mensaje enviado con éxito, gracias por tu comunicación." 
        });
    } catch (error) {
        console.error('Error al procesar el contacto:', error);
        res.status(500).json({ 
            error: 'Error al procesar tu mensaje. Por favor inténtalo de nuevo.' 
        });
    }
});

// Configuración para producción:
if (process.env.NODE_ENV === 'production') {
    // Servir archivos estáticos
    app.use(express.static(path.join(__dirname, 'Portafolio-2025')));
    
    // Manejar todas las demás rutas con el index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'Portafolio-2025', 'index.html'));
    });
}

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ status: 'API funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});