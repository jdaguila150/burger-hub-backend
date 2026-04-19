// server.js
const express = require('express');
const cors = require('cors');

// Inicializamos la aplicación
const app = express();

// Le decimos a Express que permita peticiones de otros puertos (como el de tu React)
app.use(cors());

// NUESTRA BASE DE DATOS SIMULADA
// Movimos los datos de React hacia acá.
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

// CREAMOS NUESTRO PRIMER ENDPOINT (API)
// Cuando alguien visite http://localhost:3000/api/menu, Express le enviará el JSON
app.get('/api/menu', (req, res) => {
  console.log("React me acaba de pedir el menú!");
  res.json(menuData);
});

// Encendemos el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express cocinando en http://localhost:${PORT}`);
});