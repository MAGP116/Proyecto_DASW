'use strict'

let direction = 'http://localhost:3000'

//IDs document
const CS = document.getElementById('carreraSelect');
const CI = document.getElementById('CarreraInfo');
const AM = document.getElementById('accordionMaterias');
const BS = document.getElementById('buttonSubmit');
let carreras = new Map();
let materias = [];
let materiasSelected = new Set();

//
window.onload = e =>{
    loadCarreras();
}




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

CS.onchange = async ev =>{
    CI.innerText = carreras.get(ev.target.value);
    if(ev.target.value == 'Selecciona tu carrera'){
        AM.innerHTML = '';
        return;
    }
    materias = [];
    materiasSelected.clear();
    let ms = await getMaterias(ev.target.value);
    let html = [];
    ms.forEach(e=>{
        html.push(createMateriaMedia(e))
    })
    AM.innerHTML = html.join('');
}


AM.onclick = ev =>{
    if(ev.target.id == 'accordionMaterias')return;
    let card = ev.target;
    if(ev.target.className != 'card')card = ev.target.closest('.card');
    if(card.classList.contains('proySelected')){
        card.classList.remove('proySelected');
        materiasSelected.delete(ev.target.innerText);
    }
    else{
        card.classList.add('proySelected');
        materiasSelected.add(ev.target.innerText);
    }

}

BS.onclick = async ev =>{
    ev.preventDefault();
    console.log(materiasSelected);
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