'use strict'
const express = require("express");
const alumnoRouter = require('./routes/alumno-route');
const app = express();

//Borrar lo sigiente tras las PRUEBAS
const port =  process.env.PORT || 3000;
app.listen(port, ()=>console.log("Ejecutando en puerto "+port));


//declaraciones de middleware
app.use(express.json())

//relocalizaciones API
app.use('/api/alumnos', alumnoRouter)



//relocacizaciones public
app.use(express.static(__dirname+'/public/html'))
app.use("/inicio",express.static(__dirname+'/public/html/home.html'))//Historico :3

