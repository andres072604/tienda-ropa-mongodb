# 👕 Tienda de Ropa - Base de Datos MongoDB

Primer Proyecto del curso **Desarrollo con Plataformas Abiertas**
Universidad Florencio del Castillo - Ingeniería Informática - III Cuatrimestre 2026
Docente: Daniel Bogarin Granados

## Descripción del proyecto

Base de datos no relacional para una **tienda de ropa**, pensada como base de un punto de venta o sitio web que más adelante se integrará con una REST API y un front end. Gestiona usuarios, marcas, prendas y ventas, y permite consultar la actividad comercial: ventas por fecha, marcas con ventas, stock restante y ranking de marcas.

## Tecnologías

- MongoDB
- JavaScript (mongosh / MongoDB for VS Code)
- GitHub
- Markdown

## Estructura del repositorio

```
tienda-ropa-mongodb/
├── README.md
└── database/
    ├── operaciones.js        # Creación de la BD, CRUD y consultas (con comentarios)
    └── datos_ficticios.json  # Datos de ejemplo de las 4 colecciones
```

## Base de datos y colecciones

Base de datos: `tienda_ropa_db`

Colecciones: `usuarios`, `marca`, `prendas`, `ventas`.

Las prendas referencian a su marca con `id_marca` y las ventas referencian a la prenda con `id_prenda`.

### Colección `usuarios`

```json
{
  "nombre": "Sofía Vargas",
  "correo": "sofia.vargas@email.com",
  "telefono": "8833-4455",
  "fecha_registro": "2026-10-01"
}
```

### Colección `marca`

```json
{
  "_id": 1,
  "nombre": "Nike",
  "pais": "Estados Unidos"
}
```

### Colección `prendas`

```json
{
  "_id": 101,
  "nombre": "Camisa Oversize",
  "precio": 22.5,
  "stock": 40,
  "id_marca": 3
}
```

### Colección `ventas`

```json
{
  "_id": 1001,
  "id_prenda": 101,
  "cantidad": 2,
  "fecha": "2026-10-04",
  "total": 45.0
}
```

## Consultas implementadas

1. Cantidad vendida de prendas por fecha, filtrada con una fecha específica.
2. Lista de todas las marcas que tienen al menos una venta.
3. Prendas vendidas y su cantidad restante en stock.
4. Las 5 marcas más vendidas y su cantidad de ventas.

## Integrantes

- Rafael Gómez Calderón
- David Serrano Céspedes