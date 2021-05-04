'use strict'
const mongoose = require('../db/mongodb_connect')

let materiaSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        unique:true
    },
    descripcion:{
        type:String,
        required:true
    },
    creditos:{
        type:Number,
        required:true,
    }
});

materiaSchema.statics.saveMateria = async function(subject){
    //Suponemos que para este puento el materia ya fue verificado y cuenta con los atributos necesarios
    let materia = new Materia(subject);
    let doc;
    try{
         doc = await materia.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

materiaSchema.statics.getMateria = async(filtro,atributos) =>{
    atributos = atributos ||{}
    return await Materia.findOne(filtro,atributos);
}

materiaSchema.statics.getMaterias = async(filtro,atributos) =>{
    atributos = atributos ||{};
    return await Materia.find(filtro,atributos);
}

materiaSchema.statics.getMateriaById = async(id)=>{
    return await Materia.findById(id);
}

let Materia = mongoose.model('materia', materiaSchema);

module.exports = Materia;