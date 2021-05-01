"use strict";
const router = require("express").Router();
const Val = require("../middlewares/validaciones.js");
const Materia = require("../models/Materia");
const Carrera = require("../models/Carrera");
const Profesor = require("../models/Profesor.js");

router.use(Val.validarToken, Val.validarAdmin);

router.post("/materias", Val.validarCamposMaterias, async (req, res) => {
	let { nombre, descripcion, creditos } = req.body;
	let doc = await Materia.saveMateria({ nombre, descripcion, creditos });
	if (doc) {
		res.status(201).send(doc);
		return;
	}
	res.status(400).send("No se pudo registrar la materia");
});

router.post("/carreras", Val.validarCamposCarrera, async (req, res) => {
	let { nombre, descripcion, seriacion } = req.body;
	let doc = await Carrera.saveCarrera({ nombre, descripcion, seriacion });
	if (doc) {
		res.status(201).send(doc);
		return;
	}
	res.status(400).send("No se pudo registrar la carrera");
});

router.post("/profesor", Val.validarCamposProfesor, async (req, res) => {
	let { nombre, apellido } = req.body;
	let doc = await Profesor.saveProfesor({ nombre, apellido });
	if (doc) {
		res.status(201).send(doc);
		return;
	}
	res.status.apply(400).send("No se pudo registrar el profesor");
});

module.exports = router;
