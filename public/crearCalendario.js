'use strict'

let direction = 'http://localhost:3000'
//ID's document
const AM = document.getElementById('accordionMaterias');
const CR = document.getElementById('creditos');
const MT = document.getElementById('materias');
const BB = document.getElementById('buttonBuscar');
const IN = document.getElementById('inputNombre');
const BF = document.getElementById('buttonFilters');
const IP = document.getElementById('inputProfesor');
const IH = document.getElementById('inputHoras');
const ID = document.getElementById('inputDias');
let materias = {cursadas:[],disponibles:[],bloqueadas:[]};
let TABLA = {
    LUN:[],MAR:[],MIE:[],JUE:[],VIE:[],SAB:[]
}
//
window.onload = async e =>{
    createNavBar();
    loadMaterias();
}


//a class: proySelected proyLocked
//card class: proySelected proyLocked
AM.onclick = async ev =>{
    let target = ev.target.closest('a')
    let card = ev.target.closest('.card');
    //This evaluates that 
    if(card.classList.contains('proyCompleted')||card.classList.contains('proySeriado'))return;
    let name = card.querySelector('.card-header').innerText;
    let materia = materias.disponibles.find(m=>m.nombre == name);
    //if inside of this condition, then check if first load of clases
    if(!target){
        if(materia.obtained)return;
        materia.obtained = true
        materia.creditos = (await getDetalleMateria(name)).creditos;
        let clases = await getClases(name);
        card.querySelector('.list-group').innerHTML = clases.map(c=>createClasesItemModel(c)).join('')
        materia.clases = clases;
        clases.forEach(c=>{
            if(!isSelectable(c.sesion))document.getElementById(c._id).classList.add('proyLocked')
        })
        return;
    }
    if(target.classList.contains('proyLocked'))return;
    
    let id = target.id;
    
    let clase = materia.clases.find(c=>c._id==id).sesion;
    if(target.classList.contains('proySelected')){
        //remove class
        card.classList.remove('proySelected')
        target.classList.remove('proySelected');
        //console.log(clase);
        clase.forEach(s=>removeFromTABLE(s));
        CR.innerText = (Number(CR.innerText)-materia.creditos)
        MT.innerText = (Number(MT.innerText)-1)
        
        
    }
    else if(!card.querySelector('.proySelected') && isSelectable(clase)){
        //ADD class
        card.classList.add('proySelected')
        target.classList.add('proySelected');
        clase.forEach(s=>addToTABLE(s,name));
        CR.innerText = (Number(CR.innerText)+materia.creditos)
        MT.innerText = (Number(MT.innerText)+1)
    }
    updateLocks();
    console.table(TABLA);

}

function updateLocks(){
    let mts = [];
    for(let m of AM.querySelectorAll('.card'))
        if((!m.classList.contains('proySeriado')
        && !m.classList.contains('proyCompleted') 
        && !m.classList.contains('proySelected'))
        )mts.push(m.querySelector('.card-header').innerText)
    let sMaterias = new Set(mts);
    //For every class available
    materias.disponibles.forEach(m=>{
        if(sMaterias.has(m.nombre)){
            //Find if the class is not avalibale
            m.clases.forEach(c=>{
                if(!isSelectable(c.sesion))document.getElementById(c._id).classList.add('proyLocked')
                else document.getElementById(c._id).classList.remove('proyLocked')
            })
        }
    })
    
    
}

function isSelectable(sesiones){
	//Revisa que no haya colisiones
    for(let sesion of sesiones){
        for(let clase of TABLA[sesion.dia]){
            if(!(sesion.horaFinal <= clase.horaInicio || sesion.horaInicio >= clase.horaFinal)){
                return false;
            }
        }
    }
    return true;
}

function addToTABLE(sesion,name) {
    TABLA[sesion.dia].push({horaInicio:sesion.horaInicio,horaFinal:sesion.horaFinal})
    let a = document.getElementById(sesion.horaInicio).querySelector(`.${sesion.dia}`)
    a.classList.add('proySelected')
    a.innerHTML = createCalendarClassModel(name)

}

function removeFromTABLE(sesion) {
    //console.log(sesion.dia);
    let dias = TABLA[sesion.dia].filter(s=>{
        //console.log(sesion.horaInicio,s.horaInicio);
        return!(sesion.horaInicio == s.horaInicio)
    });
    TABLA[sesion.dia] = dias;
    let a = document.getElementById(sesion.horaInicio).querySelector(`.${sesion.dia}`)
    a.classList.remove('proySelected')
    a.innerHTML = ''
}

async function loadMaterias(){
    let materiasAlumno = await getMaterias();
    if(!materiasAlumno)return;
    materias.cursadas = materiasAlumno.cursadas.map(m=>({nombre:m,clases:[]}))
    materias.bloqueadas = materiasAlumno.bloqueadas.map(m=>({nombre:m,clases:[]}))
    //materias.disponibles = materiasAlumno.disponibles.map(m=>({nombre:m,clases:[],obtained:false}))
    materias.disponibles = await loadClases(materiasAlumno.disponibles)
    let html = [];
    materias.cursadas.forEach(m=>html.push(createMateriaCardModel(m,'proyCompleted')))
    materias.disponibles.forEach(m=>html.push(createMateriaCardModel(m,'')))
    materias.bloqueadas.forEach(m=>html.push(createMateriaCardModel(m,'proySeriado')))
    
    AM.innerHTML = html.join('');
}

async function loadClases(materias){
    let size = materias.length;
    let arr = new Array(size);
     for(let i = 0; i<size;i++)arr[i] = {
        nombre:materias[i],
        clases:(await getClases(materias[i])),
        obtained:true,
        creditos:((await getDetalleMateria(materias[i])).creditos)
    };
    return arr;
}

//Button Buscar
BB.onclick = ev =>{
    let nombre = IN.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    console.log(nombre);
    if(!nombre){
        for(let card of AM.querySelectorAll('.card[hidden="true"]') )card.removeAttribute('hidden');
        for(let a of AM.querySelectorAll('a[hidden="true"]') )a.removeAttribute('hidden');
        return
    }
    for(let card of AM.querySelectorAll('a[hidden]') )card.removeAttribute('hidden');
    for(let card of AM.querySelectorAll('.card:not([hidden])') )card.setAttribute('hidden',true);
    for(let card of AM.querySelectorAll(`.card[data-info*="${nombre}"]`))card.removeAttribute('hidden');
}

//Button Filter
BF.onclick = ev =>{
    let profesor = IP.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let horas = IH.querySelectorAll('*:checked');
    let dias = ID.querySelectorAll('*:checked');
    if(!profesor && !horas && !dias){
        for(let card of AM.querySelectorAll('a[hidden="true"]') )card.removeAttribute('hidden');
        return
    }
    
    let s = new Set();
    if(profesor)s.add(profesor);
    for(let hora of horas)s.add(hora.value)
    for(let dia of dias)s.add(dia.value)
    console.log(s);

    for(let card of AM.querySelectorAll('.card[hidden="true"]') )card.removeAttribute('hidden');
    for(let card of AM.querySelectorAll('a:not([hidden])') )card.setAttribute('hidden',true);

    for(let a of AM.querySelectorAll('a')){
        let count = 0;
        //console.log(a.getAttribute("data-info").split(' '));
        for(let v of a.getAttribute("data-info").split(' ')){
            if(s.has(v))count++;
        }
        console.log(count,s.size);
        if(count == s.size)a.removeAttribute('hidden');
    }
        

}







//Contactos con el backend
async function getMaterias(){
    const resp = await fetch (`${direction}/api/materias`,{
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

async function getClases(name){
    const resp = await fetch (`${direction}/api/clases/${name}`,{
        method: 'GET'
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

async function getDetalleMateria(name){
    const resp = await fetch (`${direction}/api/materias/${name}`,{
        method: 'GET'
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}






//Generadores de HTML

function createMateriaCardModel(materia, type){
    let clases = materia.clases.map(c=>createClasesItemModel(c))
    let id = materia.nombre.split(' ').join('');
    return `
    <div class="card ${type}" data-info="${materia.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}">
				<div class="card-header" id="headingOne" >
					<h5 class="mb-0">
						<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${id}" style="text-align: left;"
							aria-expanded="true" aria-controls="collapse${id}">
							<b>${materia.nombre}</b> 
						</button>
					</h5>
				</div>
				<div id="collapse${id}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionMaterias">
					<div class="card-body">
						<div class="list-group">
                           ${clases.join('')}
                        </div>
					</div>
				</div>
			</div>
    `
}


function createClasesItemModel(clase){
    let sesiones = clase.sesion.map(c=>createSessionItemModel(c)).join('');
    return `
    <a href="#" class="list-group-item list-group-item-action" id="${clase._id}" 
    data-info="${clase.profesor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")} ${clase.sesion.map(s=>(`${s.dia} ${s.horaInicio}`)).join(' ')}">
        <table class="table-borderless">
            ${sesiones}
        </table>
        <p style="margin-bottom: 0px; padding: 0px;"><b>${clase.profesor}</b></p>
    </a>`
}

function createSessionItemModel(sesion){

    return`
        <tr style="margin-top: 0px;">
            <td style="margin-bottom: 0px; padding-top:  0px;"><p style="margin-bottom: 0px; padding: 0px;"><b>${sesion.dia}</b></p></td>
            <td style="margin-bottom: 0px; padding: 0px;"><p style="margin-left: 30px; margin-bottom: 0px; padding: 0px;">${sesion.horaInicio}:00 - ${sesion.horaFinal}:00</p></td>
        </tr>
        `
}

function createNavBarButtonModel(name,current,url){
	if(current == true)return `<li class="nav-item active"><a class="nav-link" href="#">${name}<span class="sr-only">(current)</span></a></li>`
	return `<li class="nav-item"><a class="nav-link" href="${url||"#"}">${name}</a></li>`
}

function createCalendarClassModel(sesion){
    return `<small>${sesion}</small>`
}

function createNavBar(){
	let buttons = [];
	buttons.push(
		createNavBarButtonModel(
			'<i class="fa fa-home" aria-hidden="true"></i> Página Principal',
			false,
			`${direction}/inicio`
		)
	);
	buttons.push(createNavBarButtonModel('Mis materias',false,`${direction}/materias`));
	document.getElementById('navbar').innerHTML = buttons.join('');
}


function log(a){console.log(a);}