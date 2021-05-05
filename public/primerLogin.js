'use strict'

let direction = 'http://localhost:3000'
sessionStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJpczcyMzM1OV8zQGl0ZXNvLm14IiwiaWF0IjoxNjIwMTg0Mjg0fQ.-mrozHzoPAurSeY1Zt7Ma2DebVF1moI6Dhri1qEyveg"
sessionStorage.email ="is723359_3@iteso.mx"
//IDs document
const CS = document.getElementById('carreraSelect');
const CI = document.getElementById('CarreraInfo');
const AM = document.getElementById('accordionMaterias');
const BS = document.getElementById('buttonSubmit');
let carreras = new Map();
let materias = [];
let careerAsigned;
//
window.onload = async e =>{
    loadCarreras();
    let al = await getAlumno();
    if(al.carrera)careerAsigned = al.carrera != '';
        
}



//carga de carreras
async function loadCarreras(){
    let cs = await getCarreras();
    carreras.clear();
    cs.forEach(c=>carreras.set(c.nombre,c.descripcion))
    carreras.set('Selecciona tu carrera',' ');
    let html = [];
    html.push(`<option selected>Selecciona tu carrera</option>`)
    cs.forEach(e=>{
        html.push(createCareerMedia(e.nombre));
    })
    CS.innerHTML = html.join('');

}

//Actualizacion de materias
CS.onchange = async ev =>{
    CI.innerText = carreras.get(ev.target.value);
    if(ev.target.value == 'Selecciona tu carrera'){
        AM.innerHTML = '';
        return;
    }
    materias = [];
    let ms = await getMaterias(ev.target.value);
    let html = [];
    ms.forEach(e=>{
        html.push(createMateriaMedia(e))
    })
    AM.innerHTML = html.join('');
}


//Lista de materias
AM.onclick = ev =>{
    if(ev.target.id == 'accordionMaterias')return;
    let card = ev.target;
    if(ev.target.className != 'card')card = ev.target.closest('.card');
    if(card.classList.contains('proySelected')){
        card.classList.remove('proySelected');
    }
    else{
        card.classList.add('proySelected');
    }

}


BS.onclick = async ev =>{
    ev.preventDefault();
    let materias = [];
    for(let item of AM.querySelectorAll('.proySelected'))materias.push(item.innerText);
    if(!careerAsigned){
        console.log(CS.querySelector('option[selected=true]').innerText);
    }
}


//Funciones obtener del backend

//Cargar carreras
async function getCarreras() {
    const resp = await fetch (`${direction}/api/carreras`,{
        method: 'GET'
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

//Cargar materias
async function getMaterias(carrera){
    const resp = await fetch (`${direction}/api/carreras/${carrera}`,{
        method: 'GET'
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

//Enviar carrera
async function setCarrera(carrera){
    const resp = await fetch (`${direction}/api/alumnos`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': sessionStorage.token
        },
        body: JSON.stringify({carrera})
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

async function getAlumno(){
    const resp = await fetch (`${direction}/api/alumnos/${sessionStorage.email}`,{
        method: 'GET',
        headers: {
            'x-auth': sessionStorage.token
        }
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

//Generadores de html
function createMateriaMedia(nombre){
    return `
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">
            <button class="btn btn-link" type="button" id="card${nombre}">
            <b>${nombre}</b> 
            </button>
        </h5>
    </div>
</div>
`
}

function createCareerMedia(nombre){
return `
<option>${nombre}</option>
`
}

function log(a){
    console.log(a);
}