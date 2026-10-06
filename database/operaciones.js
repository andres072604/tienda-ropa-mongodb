// Proyecto 1 - Tienda de ropa con MongoDB
// Script con la base de datos, el CRUD y las consultas

// Usar la base de datos (si no existe, se crea al insertar datos)
use("tienda_ropa_db");

// Borrar las colecciones para poder correr el script varias veces
db.usuarios.drop();
db.marca.drop();
db.prendas.drop();
db.ventas.drop();


// ---------- USUARIOS ----------

// Insertar un usuario
db.usuarios.insertOne({
    nombre: "Sofía Vargas",
    correo: "sofia.vargas@email.com",
    telefono: "8833-4455",
    fecha_registro: "2026-10-01"
});

// Insertar varios usuarios
db.usuarios.insertMany([
    { nombre: "Esteban Morales", correo: "esteban@email.com", telefono: "7722-1100", fecha_registro: "2026-10-02" },
    { nombre: "Valeria Campos", correo: "valeria@email.com", telefono: "6011-2233", fecha_registro: "2026-10-03" }
]);

// Actualizar el teléfono de un usuario
db.usuarios.updateOne(
    { correo: "sofia.vargas@email.com" },
    { $set: { telefono: "8800-0000" } }
);

// Eliminar un usuario
db.usuarios.deleteOne({ correo: "valeria@email.com" });


// ---------- MARCAS ----------

// Insertar una marca
db.marca.insertOne({ _id: 1, nombre: "Nike", pais: "Estados Unidos" });

// Insertar varias marcas
db.marca.insertMany([
    { _id: 2, nombre: "Adidas", pais: "Alemania" },
    { _id: 3, nombre: "Zara", pais: "España" },
    { _id: 4, nombre: "Levis", pais: "Estados Unidos" },
    { _id: 5, nombre: "Marca Prueba", pais: "Costa Rica" }
]);

// Actualizar el país de una marca
db.marca.updateOne({ _id: 5 }, { $set: { pais: "México" } });

// Eliminar una marca
db.marca.deleteOne({ _id: 5 });


// ---------- PRENDAS ----------

// Insertar una prenda
db.prendas.insertOne({ _id: 101, nombre: "Camisa Oversize", precio: 22.50, stock: 40, id_marca: 3 });

// Insertar varias prendas
db.prendas.insertMany([
    { _id: 102, nombre: "Pantalón Denim", precio: 45.00, stock: 25, id_marca: 4 },
    { _id: 103, nombre: "Tenis Deportivas", precio: 75.00, stock: 15, id_marca: 1 },
    { _id: 104, nombre: "Hoodie Básica", precio: 35.00, stock: 30, id_marca: 2 },
    { _id: 105, nombre: "Prenda Prueba", precio: 10.00, stock: 5, id_marca: 1 }
]);

// Actualizar el stock de una prenda
db.prendas.updateOne({ _id: 101 }, { $set: { stock: 38 } });

// Eliminar una prenda
db.prendas.deleteOne({ _id: 105 });


// ---------- VENTAS ----------

// Insertar una venta
db.ventas.insertOne({ _id: 1001, id_prenda: 101, cantidad: 2, fecha: "2026-10-04", total: 45.00 });

// Insertar varias ventas
db.ventas.insertMany([
    { _id: 1002, id_prenda: 103, cantidad: 1, fecha: "2026-10-04", total: 75.00 },
    { _id: 1003, id_prenda: 102, cantidad: 3, fecha: "2026-10-03", total: 135.00 },
    { _id: 1004, id_prenda: 104, cantidad: 2, fecha: "2026-10-04", total: 70.00 },
    { _id: 1005, id_prenda: 104, cantidad: 1, fecha: "2026-10-05", total: 35.00 }
]);

// Actualizar la cantidad y el total de una venta
db.ventas.updateOne({ _id: 1005 }, { $set: { cantidad: 2, total: 70.00 } });

// Eliminar una venta
db.ventas.deleteOne({ _id: 1005 });


// ---------- CONSULTAS ----------

// Consulta 1: cantidad de prendas vendidas en una fecha específica
// (se filtran las ventas de esa fecha y se suma la cantidad)
db.ventas.aggregate([
    { $match: { fecha: "2026-10-04" } },
    { $group: { _id: "$fecha", total_prendas_vendidas: { $sum: "$cantidad" } } }
]);

// Consulta 2: marcas que tienen al menos una venta
// (se une cada venta con su prenda y su marca, y se agrupa por nombre
// para que no salgan repetidas)
db.ventas.aggregate([
    { $lookup: { from: "prendas", localField: "id_prenda", foreignField: "_id", as: "prenda" } },
    { $unwind: "$prenda" },
    { $lookup: { from: "marca", localField: "prenda.id_marca", foreignField: "_id", as: "marca" } },
    { $unwind: "$marca" },
    { $group: { _id: "$marca.nombre" } }
]);

// Consulta 3: prendas vendidas y cuánto stock les queda
// (se suma lo vendido por prenda y se muestra junto al stock actual)
db.ventas.aggregate([
    { $group: { _id: "$id_prenda", cantidad_vendida: { $sum: "$cantidad" } } },
    { $lookup: { from: "prendas", localField: "_id", foreignField: "_id", as: "prenda" } },
    { $unwind: "$prenda" },
    { $project: { _id: 0, prenda: "$prenda.nombre", cantidad_vendida: 1, stock_restante: "$prenda.stock" } }
]);

// Consulta 4: las 5 marcas con más ventas y su cantidad de ventas
// (se cuentan las ventas por marca, se ordena de mayor a menor y se dejan 5)
db.ventas.aggregate([
    { $lookup: { from: "prendas", localField: "id_prenda", foreignField: "_id", as: "prenda" } },
    { $unwind: "$prenda" },
    { $group: { _id: "$prenda.id_marca", cantidad_ventas: { $sum: 1 } } },
    { $lookup: { from: "marca", localField: "_id", foreignField: "_id", as: "marca" } },
    { $unwind: "$marca" },
    { $project: { _id: 0, marca: "$marca.nombre", cantidad_ventas: 1 } },
    { $sort: { cantidad_ventas: -1 } },
    { $limit: 5 }
]);