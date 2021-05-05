'use strict'

let direction = 'http://localhost:3000'
sessionStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJpczcyMzM1OV8zQGl0ZXNvLm14IiwiaWF0IjoxNjIwMTg0Mjg0fQ.-mrozHzoPAurSeY1Zt7Ma2DebVF1moI6Dhri1qEyveg"
sessionStorage.email ="is723359_3@iteso.mx"
//IDs document
const CS = document.getElementById('carreraSelect');
const CI = document.getElementById('CarreraInfo');
const AM = document.getElementById('accordionMaterias');
const BS = document.getElementById('buttonSubmit');
const NAV = document.body.querySelector('nav');
let carreras = new Map();
let careerAsigned = '';
//
window.onload = async e =>{
    let al = await getAlumno();
    if(al.carrera)careerAsigned = al.carrera;
    loadCarreras();
        
}



//carga de carreras
async function loadCarreras(){
    let cs = await getCarreras();
    carreras.clear();
    cs.forEach(c=>carreras.set(c.nombre,c.descripcion))
    carreras.set('Selecciona tu carrera',' ');
    if(careerAsigned){
        CS.setAttribute('disabled','');
        CS.innerHTML = `<option selected=true>${careerAsigned}</option>`
        loadMaterias(careerAsigned);
        CI.innerText = carreras.get(careerAsigned)
        BS.removeAttribute('disabled');
        return;
    }
    let html = [];
    html.push(`<option selected=true>Selecciona tu carrera</option>`)
    cs.forEach(e=>{html.push(createCareerMedia(e.nombre));})
    CS.innerHTML = html.join('');

}

//Actualizacion de materias
CS.onchange = async ev =>{
    CI.innerText = carreras.get(ev.target.value);
    CS.querySelector('option[selected="true"]').removeAttribute('selected');
    for(let item of CS.querySelectorAll('option'))if(item.innerText == ev.target.value)item.setAttribute('selected',true);
    if(ev.target.value == 'Selecciona tu carrera'){
        AM.innerHTML = '';
        BS.setAttribute('disabled',"");
        return;
    }
    BS.removeAttribute('disabled');
    loadMaterias(ev.target.value);
    
}
async function loadMaterias(carrera){
    let ms = await getMaterias(carrera);
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
    if(card.classList.contains('proyError'))card.classList.remove('proyError');
    else if(card.classList.contains('proySelected')){
        card.classList.remove('proySelected');
    }
    else{
        card.classList.add('proySelected');
    }

}

//Envio de materias/ carrera
BS.onclick = async ev =>{
    ev.preventDefault();
    let materias = [];
    for(let item of AM.querySelectorAll('.proySelected')){materias.push(item.innerText);}
    let carrera = CS.querySelector('option[selected=true]').innerText
    //If the selected career is the default do nothing
    if(carrera == 'Selecciona tu carrera'){
        return;
    }
    let ans;
    //Asign career if no asigned
    if(!careerAsigned){
        ans = await setCarrera(carrera);
        if(!ans)return;
        careerAsigned = true;
    }
    ans = await setMaterias(materias);
    for(let item of AM.querySelectorAll('.proyError'))item.classList.remove('proyError');
    if(ans.list){
        let setBloq = new Set(ans.list);
        for(let item of AM.querySelectorAll('.proySelected'))if(setBloq.has(item.innerText)){
            item.classList.add('proyError');
        }
        createAlert('danger',`${ans.list.length == 1? 'La materia':'Las materias'}: ${ans.list.join(', ')} ${ans.list.length == 1? 'esta bloqueada por seriación':'estan bloqueadas por seriación'}`);
        return;
    }
    if(!ans.list)removeAlert();


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

async function setMaterias(materias){
    const resp = await fetch (`${direction}/api/materias`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': sessionStorage.token
        },
        body: JSON.stringify(({materias}))
    });
    if(resp.status != 201){
        //log(resp.status);
        //log(resp);
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

function removeAlert(){
    let alert = document.getElementById('alertID');
    if(alert)alert.remove();
}
function createAlert(type, message){
    removeAlert();
    NAV.insertAdjacentHTML('afterend',`<div id="alertID" class="alert alert-${type} alert-dismissible fade show" role="alert">${message} <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button></div>`);

    
}









//Funciones extras
function log(a){
    console.log(a);
}