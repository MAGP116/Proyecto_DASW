'use strict'
const express = require("express");
const alumnoRouter = require('./routes/alumno-route');
const loginRouter = require('./routes/login-route');
const materiaRouter = require('./routes/materia-route');
const adminRouter = require('./routes/admin-route');
const app = express();

//Borrar lo sigiente tras las PRUEBAS
const port =  process.env.PORT || 3000;
app.listen(port, ()=>console.log("Ejecutando en puerto "+port));


//declaraciones de middleware
app.use(express.json())

//relocalizaciones API
app.use('/api/alumnos', alumnoRouter)
app.use('/api/login', loginRouter)
app.use('/api/materias',materiaRouter)


//Cosas de admin:
app.use('/api/admin', adminRouter);



//relocacizaciones public
app.use(express.static(__dirname+'/public/html'))
app.use("/inicio",express.static(__dirname+'/public/html/home.html'))//Historico :3

