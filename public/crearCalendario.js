'use strict'



window.onload = async e =>{
    createNavBar();
}







function createNavBar(){
	let buttons = [];
	buttons.push(createNavBarButtonModel('Página Principal',false,`${dir}/inicio`));
	buttons.push(createNavBarButtonModel('Mis materias',false,`${dir}/materias`));
	document.getElementById('navbar').innerHTML = buttons.join('');
}
//Contactos con el backend




//Generadores de HTML

function createMateriaCardModel(name, clases){
    clases = clases.map(c=>createClasesItemModel(c))
}

/*
<div class="card">
				<div class="card-header" id="headingOne" style="background-color: #c3e6cb;">
					<h5 class="mb-0">
						<button class="btn btn-link selected" type="button" data-toggle="collapse" data-target="#collapseOne"
							aria-expanded="true" aria-controls="collapseOne">
							<b>Programación Orientada a Objetos</b> 
						</button>
					</h5>
				</div>
				<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
					<div class="card-body">
						<div class="list-group">
                            <a href="#" class="list-group-item list-group-item-action " > ES23U77 Profesor: Jose tacos</a>
                            <a href="#" class="list-group-item list-group-item-action  activo">ES23U76 Profesor: Manuel Santos</a>
                            <a href="#" class="list-group-item list-group-item-action ">Morbi leo risus</a>
                            <a href="#" class="list-group-item list-group-item-action bloqueado">Porta ac consectetur ac</a>
                            <a href="#" class="list-group-item list-group-item-action  " >Vestibulum at eros</a>
                        </div>
					</div>
				</div>
			</div>

*/

function createClasesItemModel(name){
    return `<a href="#" class="list-group-item list-group-item-action">${name}</a>`
}

function createNavBarButtonModel(name,current,url){
	if(current == true)return `<li class="nav-item active"><a class="nav-link" href="#">${name}<span class="sr-only">(current)</span></a></li>`
	return `<li class="nav-item"><a class="nav-link" href="${url||"#"}">${name}</a></li>`
}