const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { conexion, leerProductosDesdeJson } = require('./db');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('../public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const configuracionMySQL = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tiendaBD'
};

const conexionMySQL = mysql.createConnection(configuracionMySQL);

// Conectar a MySQL
conexionMySQL.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Insertar productos desde el archivo JSON a la base de datos
const productos = leerProductosDesdeJson();

productos.forEach(producto => {
  const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';
  const valores = [producto.nombre, producto.precio];

  conexionMySQL.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('Error al insertar producto en MySQL:', err);
      return;
    }

    console.log(`Producto insertado con ID: ${resultado.insertId}`);
  });
});


// Ruta para obtener la lista de productos desde la base de datos
app.get('/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';

  conexionMySQL.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error al obtener la lista de productos:', err);
      res.status(500).json({ mensaje: 'Error en el servidor al obtener la lista de productos.' });
      return;
    }

    res.json(resultados);
  });
});

// Ruta para procesar la compra y guardar en la base de datos
app.post('/comprar', (req, res) => {
  const { productId, cantidad } = req.body;

  const sql = 'INSERT INTO compras (productId, cantidad) VALUES (?, ?)';
  const valores = [productId, cantidad];

  conexionMySQL.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('Error al procesar la compra en MySQL:', err);
      res.status(500).json({ mensaje: 'Error en el servidor al procesar la compra.' });
      return;
    }

    res.json({ mensaje: `Compra realizada: ${cantidad} producto(s)` });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
