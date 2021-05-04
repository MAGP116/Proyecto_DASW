"use strict";
const express = require("express");
const alumnoRouter = require("./routes/alumno-route");
const loginRouter = require("./routes/login-route");
const clasesRouter = require("./routes/clases-route");
const materiaRouter = require("./routes/materia-route");
const carreraRouter = require("./routes/carrera-route");
const calendarioRouter = require("./routes/calendario-route");
const adminRouter = require("./routes/admin-route");
const app = express();

//Borrar lo sigiente tras las PRUEBAS
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Ejecutando en puerto " + port));

//declaraciones de middleware
app.use(express.json());

//relocalizaciones API
app.use("/api/alumnos", alumnoRouter);
app.use("/api/login", loginRouter);
app.use("/api/materias", materiaRouter);
app.use("/api/carreras", carreraRouter);
app.use("/api/calendarios", calendarioRouter);
app.use("/api/clases", clasesRouter);

//Cosas de admin:
app.use("/api/admin", adminRouter);

//relocacizaciones public
app.use(express.static(__dirname + "/public/"));
app.use("/inicio", express.static(__dirname + "/public/home.html")); //Historico :3
