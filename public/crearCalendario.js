'use strict'

let direction = 'http://localhost:3000'
//ID's document
const AM = document.getElementById('accordionMaterias');
let materias = {cursadas:[],disponibles:[],bloqueadas:[]};
//
window.onload = async e =>{
    createNavBar();
    loadMaterias();
}






async function loadMaterias(){
    let materiasAlumno = await getMaterias();
    if(!materiasAlumno)return;
    materias.cursadas = materiasAlumno.cursadas.map(m=>({nombre:m,clases:[]}))
    materias.bloqueadas = materiasAlumno.bloqueadas.map(m=>({nombre:m,clases:[]}))
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
        clases:(await getClase(materias[i]))
    };
    return arr;
}



function createNavBar(){
	let buttons = [];
	buttons.push(createNavBarButtonModel('Página Principal',false,`${direction}/inicio`));
	buttons.push(createNavBarButtonModel('Mis materias',false,`${direction}/materias`));
	document.getElementById('navbar').innerHTML = buttons.join('');
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

async function getClase(name){
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








//Generadores de HTML

function createMateriaCardModel(materia, type){
    let clases = materia.clases.map(c=>createClasesItemModel(c))
    let id = materia.nombre.split(' ').join('');
    return `
    <div class="card ${type}">
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

/*


*/

function createClasesItemModel(clase){
    let sesiones = clase.sesion.map(c=>createSessionItemModel(c)).join('');
    return `
    <a href="#" class="list-group-item list-group-item-action">
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


function log(a){console.log(a);}