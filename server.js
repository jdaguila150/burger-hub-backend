const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();

// Permite recibir datos en formato JSON desde React
app.use(cors());
app.use(express.json()); 

// ==========================================
// 1. CONFIGURACIÓN DEL BOT DE WHATSAPP
// ==========================================
// LocalAuth guarda la sesión para que no tengas que escanear el QR cada vez que reinicias
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ] 
    } 
});

client.on('qr', (qr) => {
    console.log('📱 ESCANEA ESTE QR CON EL WHATSAPP DEL RESTAURANTE:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ ¡Bot de WhatsApp conectado y listo para enviar mensajes!');
});

// Iniciamos el bot
client.initialize();

// ==========================================
// 2. TUS RUTAS DE EXPRESS (APIs)
// ==========================================

// Ruta del menú (La que ya tenías)
const menuData = [
  {
    id: 1,
    categoria: "Hamburguesas",
    nombre: "La Bestia Clásica",
    descripcion: "Doble carne de res, queso cheddar derretido.",
    precio: 140, // Lo cambiamos a número para poder sumarlo en el carrito
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    categoria: "Hamburguesas",
    nombre: "Pollo Crispy",
    descripcion: "Pechuga empanizada y mayonesa picante.",
    precio: 120,
    imagen: "https://images.unsplash.com/photo-1615719413546-198b25453f85?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    categoria: "Entradas",
    nombre: "Papas Gajo a la Francesa",
    descripcion: "Porción de 300g de papas condimentadas.",
    precio: 65,
    imagen: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80"
  }
];

app.get('/api/menu', (req, res) => {
    res.json(menuData);
});

// NUEVA RUTA: Recibe la reserva y envía el WhatsApp
app.post('/api/reservar', async (req, res) => {
    const { nombre, personas, fecha, hora } = req.body;

    // Número del dueño del restaurante (Debe incluir el código de país, ej. 52 para México)
    // Se le agrega '@c.us' al final, es la regla de WhatsApp
    const numeroDueño = '5215578316713@c.us'; // ¡CAMBIA ESTO POR TU NÚMERO PARA PROBAR!

    const mensajeAviso = `🚨 *NUEVA RESERVA DESDE LA WEB* 🚨\n\n👤 *Cliente:* ${nombre}\n👥 *Personas:* ${personas}\n📅 *Fecha:* ${fecha}\n⏰ *Hora:* ${hora}`;

    try {
        // El bot envía el mensaje silenciosamente
        await client.sendMessage(numeroDueño, mensajeAviso);
        console.log("Mensaje enviado con éxito al restaurante.");
        res.status(200).json({ success: true, message: "Reserva enviada con éxito" });
    } catch (error) {
        console.error("Error al enviar WhatsApp:", error);
        res.status(500).json({ success: false, message: "Error al enviar la reserva" });
    }
});

// ==========================================
// 3. ENCENDER SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express cocinando en http://localhost:${PORT}`);
    console.log(`Esperando a que WhatsApp inicie...`);
});