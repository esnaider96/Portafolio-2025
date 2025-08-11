require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Con Middleware:
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas:
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas - Cluster0'))
.catch(err => console.error('Error de conexión con MongoDB:', err));

// Ruta para manejar el formulario de contacto:
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // sU validación básica:
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Faltan campos importantes, por favor revisa de nuevo.' });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();
        
        res.status(201).json({ message: 'Mensaje enviado con éxito, gracias por tu comunicación.', contact: newContact });
    } catch (error) {
        console.error('Error al guardar el contacto, por favor intentalo de nuevo:', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
});

// La ruta de prueba:
app.get('/', (req, res) => {
    res.send('API de MONTEBYTES funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
    // Aquí coloco los archivos estáticos:
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Manejar SPA:
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}