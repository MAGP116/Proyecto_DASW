'use strict'
const mongoose = require('../db/mongodb_connect')

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
    seriasion:[{
        materiaReq:{
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'materia' 
        },
        materiaSer:{
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'materia' 
        }
    }]
});

carreraSchema.statics.saveCarrera = async function(user){
    //Suponemos que para este puento el carrera ya fue verificado y cuenta con los atributos necesarios
    let carrera = new Carrera(user);
    let doc;
    try{
         doc = await carrera.save();
    }catch(err){
         doc = undefined;
    }
    return doc;
}

let Carrera = mongoose.model('carrera', carreraSchema);

module.exports = Carrera;