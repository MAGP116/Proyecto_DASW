"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sign = "AloHom0r4 y abre te sesamo";

function validarToken(req, res, next) {
	let token = req.get("x-auth");
	if (token) {
		jwt.verify(token, sign, (err, decoded) => {
			if (err) {
				console.log(err.name);
				res.status(401).send({ error: "Token no válido" });
			} else {
				req.correo = decoded.correo;
				next();
			}
		});
	} else {
		res.status(401).send({ error: "falta token" });
	}
}

function validarAdmin(req, res, next) {
	if (req.correo && req.correo == "admin@admin.admin") {
		next();
		return;
	}
	res.status(403).send("Pemisos no otorgados");
}

function validarCamposLogin(req, res, next) {
	let { password, correo } = req.body;
	let error = "Hace falta: ";
	if (!password) {
		error += "contraseña ";
	}
	if (!correo) {
		error += "correo ";
	}
	if (!correo || !password) {
		res.status(400).send(error);
		return;
	}
	next();
}


function validarCamposMaterias(req, res, next) {
	let { nombre, descripcion, creditos } = req.body;
	let materia = { nombre, descripcion, creditos };
	let falta = "";
	for (let key in materia) if (!materia[key]) falta += key + " ";
	if (falta.length != 0) {
		res.status(400).send("Falta ingresar: " + falta);
		return;
	}
	next();
}

function validarCamposCarrera(req, res, next) {
	let { nombre, descripcion, seriacion } = req.body;
	let falta = "";
	if (!nombre || (nombre && nombre == "")) falta += "nombre ";
	if (!descripcion || (descripcion && descripcion == ""))
		falta += "descripcion ";
	if (!seriacion || seriacion.length === 0) falta += "seriacion ";
	if (falta.length != 0) {
		res.status(400).send("Falta valores de: " + falta);
		return;
	}
	let seriado;
	let seriacionfilatrado = [];
	for (let i = 0; i < seriacion.length; i++) {
		seriado = seriacion[i];
		if (!seriado) {
			falta += `i:${i} es undefined \n`;
			continue;
		}
		if (!seriado.materiaSer || (seriado.materiaSer && seriado.materiaSer == ""))
			falta += `i:${i} falta materia a cursar \n`;
		else {
			seriacionfilatrado.push({
				materiaReq: seriado.materiaReq || "",
				materiaSer: seriado.materiaSer,
			});
		}
	}
	if (falta.length != 0) {
		res.status(400).send("Falta en materias: \n" + falta);
		return;
	}
	req.body.seriacion = seriacionfilatrado;
	next();
}

function validarCamposProfesor(req, res, next) {
	let { nombre, apellido } = req.body;
	let profesor = { nombre, apellido };
	let falta = "";
	for (let key in profesor) if (!profesor[key]) falta += key + " ";
	if (falta.length != 0) {
		res.status(400).send("Falta ingresar: " + falta);
		return;
	}
	next();
}

function validarCamposClases(req,res,next){
    let {sesion, profesor,materia} = req.body;
    let clase = {sesion, profesor,materia};
    let falta = "";
    for(let key in clase)if(!clase[key])falta += key+' ';
    if(falta.length != 0){
        res.status(400).send('Falta ingresar: '+falta);
        return;
    }
    let size = sesion.length;
    let dia;
    let horario;
    for(let i = 0; i<size;i++){
        if(!sesion[i]){
            falta+=`i: ${i} es undefined`; 
            continue;
        }
        let dia = sesion[i].split('-');
        if(dia.length != 3){
            falta += `i: ${i} No tiene los atributos validos`
        }
    }

    next();
}

module.exports = {
	validarToken,
	sign,
	validarCamposLogin,
	validarAdmin,
	validarCamposMaterias,
    validarCamposCarrera,
    validarCamposProfesor
};
