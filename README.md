# Proyecto de Gestión de Películas

## Descripción
Este proyecto es una aplicación web para gestionar un catálogo de películas, permitiendo a los usuarios agregar, editar y eliminar películas de una base de datos. La arquitectura sigue el patrón MVC (Modelo-Vista-Controlador) y utiliza React en el frontend y Node.js en el backend.

---

## Tabla de Contenidos
- [Instalación](#instalación)
- [Uso](#uso)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)


---

## Instalación
### Requisitos Previos
Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (si usas esta base de datos)

### Clonar el repositorio
```bash
    git clone https://github.com/tu-usuario/proyecto-peliculas.git
    cd proyecto-peliculas
```

### Instalación del Frontend
```bash
    cd frontend
    npm install
```

### Instalación del Backend
```bash
    cd backend
    npm install
```

---

## Uso
### Ejecutar el Backend
```bash
    cd backend
    npm start
```
Por defecto, el backend correrá en `http://localhost:5000`

### Ejecutar el Frontend
```bash
    cd frontend
    npm start
```
Por defecto, el frontend correrá en `http://localhost:3000`

---

## Características
- Listar películas en una cuadrícula
- Agregar nuevas películas con título, descripción, director y rating(deifinido entre 1-5 estrellas)
- Editar información de una película existente
- Eliminar películas
- Notificaciones visuales de éxito o error

---

## Estructura del Proyecto
### 📂 Frontend (React)
- **`page.tsx`**: Componente principal de la vista.
- **`GenericForm.js`**: Formulario reutilizable para agregar y editar películas.
- **`services/api.js`**: Funciones para interactuar con el backend.

### 📂 Backend (Node.js)
- **`models/item.js`**: Esquema del modelo de película.
- **`controllers/itemController.js`**: Controlador que maneja la lógica de negocio.
- **`routes/items.js`**: Definición de las rutas API.
- **`server.js`**: Configuración del servidor Express.

---




