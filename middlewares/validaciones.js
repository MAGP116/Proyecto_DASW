"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profesor = require("../models/Profesor");
const Alumno = require('../models/Alumno.js');
const  Carrera =  require('../models/Carrera.js')
const  Clase =  require('../models/Clase.js');
const Calendario = require("../models/Calendario");
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

async function validarCamposClases(req,res,next){
    let {sesion, profesor,materia} = req.body;
    let clase = {sesion, profesor,materia};
    let falta = "";
    for(let key in clase)if(!clase[key])falta += key+' ';
    if(falta.length != 0){
        res.status(400).send('Falta ingresar: '+falta);
        return;
    }
	let b = false;
	 (await Profesor.getProfesores({},{_id:1})).forEach(p=>{if(p._id == profesor)b = true});
	
	if(!b){
		res.status(400).send('El profesor es invalido');
        return;
	}
    let size = sesion.length;
    let dia;
    let falta2;
    for(let i = 0; i<size;i++){
        if(!sesion[i]){
            falta+=`i: ${i} es undefined\n`; 
            continue;
        }
        let falta2 = '';
        let dia = sesion[i];
        if(!dia.dia|| dia.dia && dia.dia == ''){
            falta2 += 'falta dia '
        }
        if(!dia.horaInicio|| dia.horaInicio && (dia.horaInicio  > 22 || dia.horaInicio  < 7)){
            falta2 += !dia.horaInicio?'falta hora de inicio ':' hora de inicio no valida';
        }
        if(!dia.horaFinal|| dia.horaFinal && (dia.horaFinal  > 22 || dia.horaFinal  < 7)){
            falta2 += !dia.horaFinal?'falta hora final ':' hora de final no valida';
        }
        if(dia.horaInicio && dia.horaFinal &&  typeof dia.horaInicio === Number && typeof dia.horaFinal === Number && dia.horaInicio >= dia.horaFinal){
            falta2 += 'La clase no puede empezar despues de terminar.'
        }
        if(falta2.length != 0)falta += `i: ${i} ${falta2}`;
    }
    if(falta.length != 0){
        res.status(400).send(falta);
        return;
    }

    next();
}

async function convertirProfesores(doc){
	let size = doc.length;
	for(let i = 0; i<size; i++){
		let{nombre,apellido} = await Profesor.getProfesorById(doc[i].profesor);
		doc[i].profesor =(nombre+' '+apellido);
	}
	return doc;
}

async function obtenerMaterias(req,res,next){
	let cursadas = await Alumno.getAlumno({correo:req.correo},{_id:0,materia:1,carrera:1})
    let carrera = cursadas.carrera;
    cursadas = cursadas.materia;
    let setCur = new Set(cursadas);
    let matCarrera = await Carrera.getCarrera({nombre:carrera},{_id:0,seriacion:1});
    matCarrera = matCarrera.seriacion;
    let setCarrera  = new Set(matCarrera.map(m=>m.materiaSer));
    let setBloquedas = new Set();
    matCarrera.forEach(m=>{
        if(!(setCur.has(m.materiaReq) || (m.materiaReq == ''))){
            setCarrera.delete(m.materiaSer)
            setBloquedas.add(m.materiaSer);
        }
        if(setCur.has(m.materiaSer)){
            setCarrera.delete(m.materiaSer);
        }
    })
    let materias = {
        cursadas:(Array.from(setCur)),
        disponibles: Array.from(setCarrera),
        bloqueadas: Array.from(setBloquedas)

    }
	req.body.materias = materias;
	next();
}

async function validarCamposCalendario(req,res,next){
	let {nombre,clases,materias} = req.body;
	let falta = '';
	if(!nombre || nombre && nombre == '')falta += 'nombre '
	if(!clases)falta+= 'clases';
	if(falta.length != 0){
		res.status(400).send('Falta: '+falta);
		return;
	}
	let clase;
	let setClases = new Set();
	let disponibles = new Set(materias.disponibles);
	let horarios = {
		LUN:[],MAR:[],MIE:[],JUE:[],VIE:[],SAB:[]
	}
	let size =clases.length
	for(let i = 0; i<size; i++){
		if(!clases[i]){
			falta += `${i} Falta el ID\n`;
		}
		else{
			//Verifica la existencia de cada clase y se asegura de que sea una clase valida
			clase = await Clase.getClaseById(clases[i]);
			//console.log("CLASE",clase);
			if(!clase)falta += `${i} Clase no Encontrada\n`
			else if(!disponibles.has(clase.materia)) falta += `${i} Materia no Disponible\n`
			else if(setClases.has(clase))falta += `${i} La clase es repetida\n`
			else {
				let colision = false;
				//Revisa que no haya colisiones
				clase.sesion.forEach(s=>{
					horarios[s.dia].forEach(d=>{
						//Se busca por cada horario si hay alguna colisión
						if(!(s.horaFinal <= d.horaInicio || s.horaInicio >= d.horaFinal)){
							falta += `${i} La clase colisiona\n`;
							//console.log("s: inicio: ",s.horaInicio,": ",s.horaFinal,"| d: ",d.horaInicio,": ",d.horaFinal);
							colision = true;
						}
				
					})
				}) 
				//Si llega aqui es una clase valida, se añade a las clases aceptadas y se ponen sus horarios
				if(!colision){
					setClases.add(clase);
					clase.sesion.forEach(s=>{
						horarios[s.dia].push({
							horaInicio:s.horaInicio,
							horaFinal:s.horaFinal
						})
					})

				}
			}
		}
		
	}
	//console.log("falta: ",falta,"\nhorarios",horarios,"\nClses",setClases);
	if(falta != ''){
		res.status(400).send('Falta:\n'+falta);
		return;
	}
	next();
}

async function ajustarEdicionCalendario(req,res,next){
	let calendario = await Calendario.getCalendarioById(req.params.calendario);
	if(calendario.alumno != req.correo){
		res.status(403).send('No tiene autorización')
		return;
	}
	if(!req.body.nombre || req.body.nombre && req.body.nombre == ''){
		if(!calendario){
			res.status(404).send('Calendario no encontrado');
			return;
		}
		req.body.nombre = calendario.nombre;
	}
	next();
}

//Node is a list of materias, edges is a list of dependencies
function topologicSort(vertex,edgesList){
	//El set contiene todas las materias
	let set = new Set(vertex);
	let starts = [];
	let vertices = new Map();
	edgesList.forEach(e =>{
		//Si la materia no tiene requerimeintos es un inicio
		if(e.materiaReq == ''){
			starts.push(e.materiaSer);
		}
		else{
			//Si la materia es requerida para alguna entonces se crea su objeto
			let node = vertices.get(e.materiaReq);
			if(!node){
				node = {name:e.materiaReq,color:true,edges:[]}
				set.delete(e.materiaReq);
			}
			node.edges.push(e.materiaSer);
			vertices.set(e.materiaReq,node);
		}
	})
	//Todas las materias que no tienen dependencias o son las más dependientes son creadas aqui
	for(let item of set)vertices.set(item,{name:item,color:true,edges:[]})
	let listSorted = []
	//Funcion recursiva del rdenamiento, se declara aqui para aprovechar las variables de las fucion principal
	let topologicSortRecursive = (node)=>{
		node.color=false;
		let n;
		node.edges.forEach(w=>{
			n = vertices.get(w)
			if(n.color== true)topologicSortRecursive(n);
		})
		listSorted.unshift(node.name);
	}

	//Se realiza el ordenamieto por cada nodo inicial
	starts.forEach(s =>{
		let node = vertices.get(s);
		topologicSortRecursive(node)
	})
	return listSorted;

	
}


module.exports = {
	validarToken,
	sign,
	validarCamposLogin,
	validarAdmin,
	validarCamposMaterias,
    validarCamposCarrera,
    validarCamposProfesor,
    validarCamposClases,
	convertirProfesores,
	obtenerMaterias,
	validarCamposCalendario,
	ajustarEdicionCalendario,
	topologicSort
};
