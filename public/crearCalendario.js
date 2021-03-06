'use strict'
if(!sessionStorage.token || sessionStorage.token && sessionStorage.token == undefined)window.location.href = `.`;
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
const BG = document.getElementById('buttonGuardarCal');
const CN = document.getElementById('calendarName');
const MF = document.getElementById('modalFiltros');
let materias = {cursadas:[],disponibles:[],bloqueadas:[]};

const urlParams = new URLSearchParams(window.location.search);
const calendarId = urlParams.get("calendarId");

let TABLA = {
    LUN:[],MAR:[],MIE:[],JUE:[],VIE:[],SAB:[]
}
//
window.onload = async e =>{
    createNavBar();
    await loadMaterias();
    if(calendarId)loadUserCalendar();
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
    //console.table(TABLA);
    unlockButtonGuardar();

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
    $("#modalFiltros").modal("toggle");
    let profesor = IP.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let horas = IH.querySelectorAll('*:checked');
    let dias = ID.querySelectorAll('*:checked');
    if(!profesor && horas.length == 0 && dias.length == 0){
        for(let a of AM.querySelectorAll('a[hidden="true"]') )a.removeAttribute('hidden');
        for(let card of AM.querySelectorAll('.card[hidden="true"]') ){
            card.removeAttribute('hidden');
        }
        
        return
    }
    
    let s = new Set();
    for(let hora of horas)s.add(hora.value)
    for(let dia of dias)s.add(dia.value)
    //console.log(s);

    for(let card of AM.querySelectorAll('.card') ){
        //console.log(card);
        let count = false;
        for(let a of card.querySelectorAll('a')){
            let coincidences = new Set();
            //console.log(a.getAttribute("data-info").split(' '));
            for(let v of a.getAttribute("data-info").split(' ')){
                if(s.has(v))coincidences.add(v)
                if(profesor && v.includes(profesor))coincidences.add(v)
            }
            //console.log(coincidences.size,s.size+(profesor?1:0));
            if(coincidences.size == s.size+(profesor?1:0)){
                count = true;
                a.removeAttribute('hidden');
            }
            else{
                a.setAttribute('hidden',true)
            }

        }
        if(count){
            card.removeAttribute('hidden')
        }
        else card.setAttribute('hidden',true)
    }   

}

CN.oninput = unlockButtonGuardar;

function unlockButtonGuardar(ev){
    if(CN.value != '' && Number(MT.innerText) > 0){
        BG.removeAttribute('disabled')
    }
    else{
        BG.setAttribute('disabled',true);
    }
}

BG.onclick = async ev =>{
    let clases = Array.from(AM.querySelectorAll('a.proySelected')).map(c=>c.getAttribute('id'))
    let calendario = undefined;
    if(!calendarId)calendario = {
            nombre:(CN.value),
            clases:(clases),
            alumno:sessionStorage.email
        }
    else calendario = {
            nombre:(CN.value),
            clases:(clases),
    }
    let ans;
    if(!calendarId) ans = await setCalendario(calendario)
    else  ans = await updateCalendario(calendario)
    if(ans) window.location.href = `./inicio`;
    else createAlert('danger','Error en subida de caledario, intentalo m??s tarde')
}










async function loadUserCalendar(){
    let calendario = await getCalendario(calendarId);
    if(!calendario){
        createAlert('danger','No se encontr?? el calendario')
        return;
    }
    if(calendario.alumno != sessionStorage.email)window.location.href = `./inicio`;
    calendario.clase.forEach(clase=>{
        let a = document.getElementById(clase);
        let card = a.closest('.card');
        card.classList.add('proySelected')
        a.classList.add('proySelected');

        let c = undefined;
        let name = undefined;
        //This find the class
        for(let m of materias.disponibles){
            for(let cl of m.clases){
                if(clase == cl._id){
                    c = cl;
                    name = m.nombre;
                    break;
                }
            }

            if(c){
                CR.innerText = (Number(CR.innerText)+m.creditos)
                MT.innerText = (Number(MT.innerText)+1)
                break;
            }
        }
        c.sesion.forEach(s=>addToTABLE(s,name));
        
        
    })
    CN.value = calendario.nombre
    updateLocks();
}








//Contactos con el backend
async function getMaterias(){
    const resp = await fetch (`./api/materias`,{
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
    const resp = await fetch (`./api/clases/${name}`,{
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
    const resp = await fetch (`./api/materias/${name}`,{
        method: 'GET'
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

async function setCalendario(calendario){
    const resp = await fetch (`./api/calendarios`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': sessionStorage.token
        },
        body: JSON.stringify(calendario)
    });
    if(resp.status != 201){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}

async function updateCalendario(calendario){
    const resp = await fetch (`./api/calendarios/${calendarId}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth': sessionStorage.token
        },
        body: JSON.stringify(calendario)
    });
    if(resp.status != 200){
        log(resp.status);
        log(resp);
        return;
    }
    return await resp.json();
}



async function getCalendario(id){
    const resp = await fetch (`./api/calendarios/${id}`,{
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
			'<i class="fa fa-home" aria-hidden="true"></i> P??gina Principal',
			false,
			`./inicio`
		)
	);
	buttons.push(createNavBarButtonModel('Mis materias',false,`./materias`));
	document.getElementById('navbar').innerHTML = buttons.join('');
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


function log(a){console.log(a);}



document.getElementById("userbtn").addEventListener("click", modalUserInfo);

async function modalUserInfo() {
	let response = await fetch(`./api/alumnos/` + sessionStorage.email, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let user = await response.json();
	let modalHTML = `<div class="modal left fade user" id="userModal" tabindex="" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header" style="padding-bottom: 0;">
        <h3>Mis datos</h3>
      </div>
      <div class="modal-body">
        <div class="nav flex-sm-column flex-row">
          <form id="form_registro">
            <div class="row">
              <div class="col">
                <input id="nom" type="text" class="form-control" placeholder="Nombre o nombres" value="${user.nombre}" disabled
                required />
              </div>
              <div class="col">
                <input id="ape" type="text" class="form-control" placeholder="Apellidos" value="${user.apellido}" disabled required />
              </div>
            </div>
            <input id="matricula" class="form-control mt-3" type="text" name="matricula" value="${user.matricula}" disabled
            required />
            <input id="carrera" class="form-control mt-3" type="text" name="carrera" value="${user.carrera}" disabled required />
            <input id="corr" class="form-control mt-3" type="email" name="correo" value="${user.correo}" disabled
            required />
            <div class="modal-footer">
						<button id="logOffbtn" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar sesi??n</button>
              <button id="btnEditUserInfo" type="submit" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#editUserModal">Editar</button>
            </div>
          </form>
        </div>
      </div>   
    </div>
  </div>
  </div>`;
	document.getElementById("modalesUsuario").innerHTML = modalHTML;
	document.getElementById('logOffbtn').addEventListener('click', logOff);
	document.getElementById("btnEditUserInfo").addEventListener("click", modalEditUserInfo);
	await $("#userModal").modal("toggle");
}

function logOff() {
	sessionStorage.removeItem("token");
	sessionStorage.removeItem("email");
	window.location.href = "./index.html";
}

async function modalEditUserInfo() {
	let response = await fetch(`./api/alumnos/` + sessionStorage.email, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let user = await response.json();
	let modalHTML = `<div class="modal left fade" id="editUserModal" tabindex="" role="dialog" aria-labelledby="userModalLabel"aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header" style="padding-bottom: 0;">
          <h3>Mis datos</h3>
        </div>
        <div class="modal-body">
          <div class="nav flex-sm-column flex-row">
            <form id="form_Update">
              <div class="row">
                <div class="col">
                  <input id="nomUpdate" type="text" class="form-control" placeholder="Nombre o nombres" value="${user.nombre}" required />
                </div>
                <div class="col">
                  <input id="apeUpdate" type="text" class="form-control" placeholder="Apellidos" value="${user.apellido}" required />
                </div>
              </div>
              <input id="matriculaUpdate" class="form-control mt-3" type="text" name="matricula" value="${user.matricula}" disabled required />
              <input id="carreraUpdate" class="form-control mt-3" type="text" name="carrera" value="${user.carrera}" disabled required />
              <input id="corrUpdate" class="form-control mt-3" type="email" name="correo" value="${user.correo}" disabled required />
              <input id="passUpdate" class="form-control mt-3" type="password" name="password" value="" id="password" placeholder="Contrase??a" required />
              <input id="confpassUpdate" class="form-control mt-3" type="password" name="password" value="" id="confirmpassword" placeholder="Confirmar contrase??a" required />
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" data-toggle="modal"data-target="#userModal">Volver</button>
                <button id="btnConfirmarEdicion" type="submit" class="btn btn-primary" data-dismiss="modal">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>`;
	document.getElementById("modalesUsuario").innerHTML = modalHTML;
	document
		.getElementById("btnConfirmarEdicion")
		.addEventListener("click", verifyPUT);
	await $("#editUserModal").modal("toggle");
}

async function verifyPUT() {
	let password = document.getElementById("passUpdate").value;
	let confirmpassword = document.getElementById("confpassUpdate").value;
	let nombre = document.getElementById("nomUpdate").value;
	let apellido = document.getElementById("apeUpdate").value;
	if (password && (password != confirmpassword || password == "")) {
		console.log("Contrase??as no v??lidas");
		modalUserInfo();
	} else {
		let updatedUser = { nombre, apellido, password };
		let response = await fetch(`./api/alumnos/`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				"x-auth": sessionStorage.token,
			},
			body: JSON.stringify(updatedUser),
		});

		let user = await response.json();
		modalUserInfo();
	}
}