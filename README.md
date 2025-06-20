# Proyecto_DASW - Simulador de Horarios

A web-based schedule simulator application for students to plan and manage their class schedules efficiently. Built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Secure login and registration system for students
- **Schedule Management**: Create, view, and manage personal class schedules
- **Course Management**: Browse and select courses and subjects
- **Career Path Support**: Organize schedules by academic career paths
- **Responsive Design**: Modern UI built with Bootstrap for all devices
- **Real-time Updates**: Dynamic schedule updates and modifications

## 🛠 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 4
- **CORS**: Cross-origin resource sharing enabled
- **Package Manager**: npm

## 🚀 Installation

### Prerequisites

- Node.js (version 14.15.5 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/MAGP116/Proyecto_DASW.git
   cd Proyecto_DASW
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB connection**
   - Update the MongoDB connection string in `db/config.js`
   - Ensure MongoDB is running locally or update with your MongoDB Atlas connection string

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 📖 Usage

### For Students

1. **Registration**: Create a new account with your student information
2. **Login**: Access your account using email and password
3. **Create Schedules**: Build personalized class schedules
4. **Manage Courses**: Add or remove courses from your schedule
5. **View Details**: See detailed information about your selected courses

### For Administrators

- Access admin features through `/api/admin` endpoints
- Manage students, courses, and system-wide configurations

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/alumnos` - Student registration

### Students
- `GET /api/alumnos` - Get student information
- `PUT /api/alumnos/:id` - Update student profile
- `DELETE /api/alumnos/:id` - Delete student account

### Schedules
- `GET /api/calendarios` - Get user schedules
- `POST /api/calendarios` - Create new schedule
- `PUT /api/calendarios/:id` - Update schedule
- `DELETE /api/calendarios/:id` - Delete schedule

### Courses & Subjects
- `GET /api/materias` - Get available subjects
- `GET /api/carreras` - Get career paths
- `GET /api/clases` - Get class information

### Admin
- `GET /api/admin/*` - Administrative endpoints

## 📁 Project Structure

```
Proyecto_DASW/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── db/                    # Database configuration
│   ├── config.js         # Database settings
│   └── mongodb_connect.js # MongoDB connection
├── models/               # Mongoose data models
│   ├── Alumno.js        # Student model
│   ├── Calendario.js    # Schedule model
│   ├── Carrera.js       # Career model
│   ├── Clase.js         # Class model
│   ├── Materia.js       # Subject model
│   └── Profesor.js      # Professor model
├── routes/               # API route handlers
│   ├── admin-route.js   # Admin routes
│   ├── alumno-route.js  # Student routes
│   ├── calendario-route.js # Schedule routes
│   ├── carrera-route.js # Career routes
│   ├── clases-route.js  # Class routes
│   ├── login-route.js   # Authentication routes
│   └── materia-route.js # Subject routes
├── middlewares/          # Custom middleware
│   ├── validaciones.js  # General validations
│   └── validacionesAlumnos.js # Student-specific validations
└── public/              # Frontend static files
    ├── index.html       # Main landing page
    ├── home.html        # Dashboard
    ├── crearCalendario.html # Schedule creation
    ├── detalleCalendario.html # Schedule details
    ├── detalleUsuario.html # User profile
    ├── primerLogin.html # First-time login
    └── img/            # Application images
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🐛 Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/MAGP116/Proyecto_DASW/issues) on GitHub.


---

**Note**: This project is part of the DASW (Desarrollo de Aplicaciones y Servicios Web) course project.
