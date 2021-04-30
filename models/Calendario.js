'use strict'
const mongoose = require('../db/mongodb_connect')

let calendarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    alumno:{
        type:String,
        required:true
    },
    clase:[{
        type:String
    }]
});

calendarioSchema.statics.saveCalendario = async function(calendar){
    //Suponemos que para este puento el calendario ya fue verificado y cuenta con los atributos necesarios
    let calendario = new Calendario(calendar);
    let doc;
    try{
         doc = await calendario.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

calendarioSchema.statics.getCalendario = async function (filtro) {
    let doc = await Calendario.findOne(filtro);
    return doc;
}

calendarioSchema.statics.getCalendarioById = async function(id){
    return await Calendario.findById(id);
}

let Calendario = mongoose.model('calendario', calendarioSchema);

module.exports = Calendario;