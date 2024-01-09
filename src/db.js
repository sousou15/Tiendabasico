const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// Ruta al archivo productos.json
const productosJsonPath = path.join(__dirname, '..', 'public', 'productos.json');

// Función para leer los productos desde el archivo JSON
const leerProductosDesdeJson = () => {
  try {
    const data = fs.readFileSync(productosJsonPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer productos desde el archivo JSON:', error);
    return [];
  }
};

// Configuración de la conexión a MySQL
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tiendaBD'
});

// Conectar a MySQL
conexion.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Exportar la conexión y la función para leer productos desde el JSON
module.exports = {
  conexion,
  leerProductosDesdeJson
};
