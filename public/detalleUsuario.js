let dir = "http://localhost:3000";

//----------------------navegation Bar--------------------------------------


async function modalUserInfo() {
	let response = await fetch(`${dir}/api/alumnos/` + sessionStorage.email, {
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
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar sesión</button>
              <button id="btnEditUserInfo" type="submit" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#editUserModal">Editar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>`;
	document.getElementById('modalesUsuario').innerHTML = modalHTML;
  document.getElementById('LogOff').addEventListener('click', logOff);
	document.getElementById('btnEditUserInfo').addEventListener('click', modalEditUserInfo);
	await $("#userModal").modal("toggle");
}

function logOff(){
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('email');
  window.location.href = "./index.html";
}

async function modalEditUserInfo() {
	let response = await fetch(`${dir}/api/alumnos/` + sessionStorage.email, {
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
              <input id="passUpdate" class="form-control mt-3" type="password" name="password" value="" id="password" placeholder="Contraseña" required />
              <input id="confpassUpdate" class="form-control mt-3" type="password" name="password" value="" id="confirmpassword" placeholder="Confirmar contraseña" required />
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
	if (password != confirmpassword || password == "") {
		console.log("Contraseñas no válidas");
		modalUserInfo();
	} else {
		let updatedUser = { nombre, apellido, password };
		let response = await fetch(`${dir}/api/alumnos/`, {
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
document.getElementById("userbtn").addEventListener("click", modalUserInfo);
//----------------------------------------------------------------------------

window.onload = async function () {
  createNavBar()
	let response = await fetch(`${dir}/api/materias/`, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let materias = await response.json();
  materiasCursadasArrayToHTML(materias.cursadas)
  materiasDisponiblesArrayToHTML(materias.disponibles);
  materiasBloqueadasArrayToHTML(materias.bloqueadas);
};

let t = 1
async function materiasCursadasArrayToHTML(cursadas){
  let materiasCursadasHTML = [];
  for(let i = 0; i < cursadas.length; i++){
    let string = await materiaCursadaToHTML(cursadas[i])
    materiasCursadasHTML.push(string);
  }
	materiasCursadasHTML = materiasCursadasHTML.join("");
	document.getElementById("clasesCursadas").innerHTML = materiasCursadasHTML; 
}

async function materiaCursadaToHTML(materia){
  let response = await fetch(`${dir}/api/materias/`+materia, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let materiaDetails = await response.json();
  let materiaHTML = 
  `<div class="card">
    <div class="card-header" id="headingOne" style="background-color: #c3e6cb;">
      <h5 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${t}"
          aria-expanded="true" aria-controls="collapse${t}" style="color: #155724;">
          <b>${materia}</b> 
        </button>
      </h5>
    </div>
    <div id="collapse${t}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body" style="background-color:#d4edda; color: #155724;">
        <div class="row">
          <div class="col-7">
            <b>Descripción</b>
          </div>
        </div>
        <div class="row">
          <div class="col-7">
            ${materiaDetails.descripcion}
          </div>
          <div class="col"><b>Créditos</b> ${materiaDetails.creditos}</div>
        </div>
      </div>
    </div>
  </div>`
  t++;
  return materiaHTML;
}

async function materiasDisponiblesArrayToHTML(disponibles){
  let materiasDisponiblesHTML = [];
  for(let i = 0; i < disponibles.length; i++){
    let string = await materiaDisponibleToHTML(disponibles[i])
    materiasDisponiblesHTML.push(string);
  }
	materiasDisponiblesHTML = materiasDisponiblesHTML.join("");
	document.getElementById("clasesDisponibles").innerHTML = materiasDisponiblesHTML;
}

async function materiaDisponibleToHTML(materia){
  let response = await fetch(`${dir}/api/materias/`+materia, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
  let materiaDetails = await response.json();
  let materiaHTML = 
  `<div class="card">
    <div class="card-header" id="headingOne">
      <h5 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${t}"
          aria-expanded="true" aria-controls="collapse${t}">
          <b>${materia}</b>
        </button>
      </h5>
    </div>
    <div id="collapse${t}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <b>Descripción</b>
          </div>
        </div>
        <div class="row">
          <div class="col-7">
          ${materiaDetails.descripcion}
          </div>
          <div class="col"><b>Créditos</b>  ${materiaDetails.creditos}</div>
        </div>
      </div>
    </div>
  </div>`;
  t++;
  return materiaHTML
}

async function materiasBloqueadasArrayToHTML(bloqueadas){
  let materiasBloqueadasHTML = [];
  for(let i = 0; i < bloqueadas.length; i++){
    let string = await materiaBloqueadaToHTML(bloqueadas[i])
    materiasBloqueadasHTML.push(string);
  }
	materiasBloqueadasHTML = materiasBloqueadasHTML.join("");
	document.getElementById("clasesBloqueadas").innerHTML = materiasBloqueadasHTML;
}

async function materiaBloqueadaToHTML(materia){
  let response = await fetch(`${dir}/api/materias/`+materia, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
  let materiaDetails = await response.json();
  let materiaHTML = 
  `<div class="card">
    <div class="card-header" id="headingOne" style="background-color: #f5c6cb">
      <h5 class="mb-0">
      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${t}"
        aria-expanded="true" aria-controls="collapse${t}" style="color: #721c24;">
          <b>${materia}</b>
        </button>
      </h5>
    </div>
    <div id="collapse${t}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body" style="color: #721c24; background-color: #f8d7da">
        <div class="row">
          <div class="col-7">
            <b>Descripción</b>
          </div>
        </div>
        <div class="row">
          <div class="col-7">
          ${materiaDetails.descripcion}
          </div>
          <div class="col"><b>Créditos</b>  ${materiaDetails.creditos}</div>
        </div>
      </div>
    </div>
  </div>`;
  t++;
  return materiaHTML
}


function createNavBar(){
	let buttons = [];
	buttons.push(createNavBarButtonModel('Página Principal',false,`${dir}/inicio`));
	buttons.push(createNavBarButtonModel('Mis materias',true));
	document.getElementById('navbar').innerHTML = buttons.join('');
}
function createNavBarButtonModel(name,current,url){
	if(current == true)return `<li class="nav-item active"><a class="nav-link" href="#">${name}<span class="sr-only">(current)</span></a></li>`
	return `<li class="nav-item"><a class="nav-link" href="${url||"#"}">${name}</a></li>`
}
