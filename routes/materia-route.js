const router = require('express').Router();
const  Materia =  require('../models/Materia.js')
const Val = require("../middlewares/validaciones.js");
const Alumno = require('../models/Alumno.js');
const  Carrera =  require('../models/Carrera.js');


router.get('/',Val.validarToken,Val.obtenerMaterias,async (req,res)=>{
    
    res.status(200).send(req.body.materias);

})

router.get('/:materia',async (req,res)=>{
    let materia = await Materia.getMateria({nombre:req.params.materia},{});
    if(materia){
        res.status(200).send(materia);
        return;
    }
    res.status(404).send('Materia no encontrada');
})


router.put('/',Val.validarToken,async(req,res)=>{
    let alumno = await Alumno.getAlumno({correo:req.correo});
    if(!alumno || alumno && !alumno.carrera){
        res.status(400).send('Materias no actualizadas');
        return;
    }
    //Se revisa que existan las materias;
    let matServer = await Materia.getMaterias({},{_id:0,nombre:1});
    let s = new Set(matServer.map(e=>e.nombre));
    let falta = '';
    let materias = req.body.materias;
    let size = materias.length;
    for(let i = 0; i<size;i++){
        if(!s.has(materias[i]))falta+=`${i} Materia: ${materias[i]} no existente\n`
    }
    if(falta.length != 0){
        res.status(400).send(falta);
        return;
    }

    let carrera = await Carrera.getCarrera({nombre:alumno.carrera})
    
    //Se revisa la dependencia de las materias
    //Crea un mapa que contiene las seriaciones invertidas (dependencias) de la carrera
    let seracion = new Map();
    carrera.seriacion.forEach(e =>{
        let m = seracion.get(e.materiaSer);
        if(!m)m= [];
        if(e.materiaReq != '')m.push(e.materiaReq);
        seracion.set(e.materiaSer,m);
    } );

    //Obtiene las materias ordenadas de forma topologica
    let materiasTSort = Val.topologicSort(seracion.keys(),carrera.seriacion);
    //Obtiene las materias del alumno en un set
    materias = new Set(req.body.materias);
    let materiaList = new Set();
    //Se revisan las materias en orden topologico para garantizar que se cumplen las dependencias
    falta = '';
    let errList = []
    materiasTSort.forEach(m=>{
        //Si la materia ha sido cursada por el alumno.
        if(materias.has(m)){
            let b = true;
            //Se evalua que ya haya cursado las anteriores.
            seracion.get(m).forEach(d=>{
                if(!materiaList.has(d)){
                    falta += `${d} `
                    b = false;
                }
            })
            //Si falta alguna materia no se coloca la materia actual
            if(!b){
                falta += `| ${m}\n`
                errList.push(m);
            }
            else materiaList.add(m);
        }
    })
    if(falta.length != 0){
        res.status(400).send({message:falta,list:errList});
        return;
    }
    
    let doc = await Alumno.updateAlumno({correo:req.correo},{materia:Array.from(materias)});
    if(!doc){
        res.status(400).send('Materias no actualizadas')
        return;
    }
    res.status(201).send(doc);
})

module.exports = router;