"use strict";
const mongoose = require("../db/mongodb_connect");

let carreraSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        unique:true
    },
    descripcion:{
        type:String,
        required:true
    },
    seriacion:[{
        materiaReq:{
          type:String,
        },
        materiaSer:{
          type:String,
          required:true
        }
    }]
});

carreraSchema.statics.saveCarrera = async function(obj){
    //Suponemos que para este puento el carrera ya fue verificado y cuenta con los atributos necesarios
    let carrera = new Carrera(obj);
    let doc;
    try{
         doc = await carrera.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}


carreraSchema.statics.getCarreras = async (filtro) => {
	return await Carrera.find(filtro);
};

carreraSchema.statics.getCarrera = async (filtro) => {
	return await Carrera.findOne(filtro);
};

carreraSchema.statics.getCarreraById = async (id) => {
	return await Carrera.findById(id);
};

let Carrera = mongoose.model("carrera", carreraSchema);

module.exports = Carrera;
