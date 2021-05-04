"use strict";
const router = require("express").Router();
const Alumno = require("../models/Alumno");
const Val = require("../middlewares/validaciones.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", Val.validarCamposLogin, async (req, res) => {
	let { correo } = req.body;
	let usuario = await Alumno.getAlumnobyEmail(correo);
	if (!usuario) {
		res.status(404).send("El usuario o contraseña no coinciden");
		return;
	}
	bcrypt
		.compare(req.body.password, usuario.password)
		.then((r) => {
			if (r) {
				let token = jwt.sign({ correo: correo }, Val.sign);
				res.status(200).send({ token: token });
			} else {
				res.status(404).send("El usuario o contraseña no coinciden");
				return;
			}
		})
		.catch((err) => console.log(err));
});

module.exports = router;
