"use strict";
const mongoose = require("../db/mongodb_connect");

let calendarioSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: true,
	},
	alumno: {
		type: String,
		required: true,
	},
	clase: [
		{
			type: String,
		},
	],
});

calendarioSchema.statics.saveCalendario = async function (calendar) {
	//Suponemos que para este puento el calendario ya fue verificado y cuenta con los atributos necesarios
	let calendario = new Calendario(calendar);
	let doc;
	try {
		doc = await calendario.save();
	} catch (err) {
		doc = undefined;
	}
	return doc;
};

calendarioSchema.statics.getDetalleCalendario = async (filter) => {
	return await Calendario.find(filter, {_id: 0, nombre: 1, alumno: 1, clase: 1,});
};

calendarioSchema.statics.getCalendarios = async (correo) => {
	return await Calendario.find(
		{ alumno: correo },
		{ _id: 0, nombre: 1, alumno: 1 }
	);
};

calendarioSchema.statics.getCalendario = async function (filtro) {
	let doc = await Calendario.findOne(filtro);
	return doc;
};

calendarioSchema.statics.getCalendarioById = async function (id) {
	return await Calendario.findById(id);
};

let Calendario = mongoose.model("calendario", calendarioSchema);

module.exports = Calendario;
