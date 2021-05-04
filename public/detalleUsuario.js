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
	document.getElementById("modalesUsuario").innerHTML = modalHTML;
	document
		.getElementById("btnEditUserInfo")
		.addEventListener("click", modalEditUserInfo);
	await $("#userModal").modal("toggle");
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
//----------------------------------------------------------------------------
document.getElementById("userbtn").addEventListener("click", modalUserInfo);
window.onload = async function () {
	let response = await fetch(`${dir}/api/materias/`, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let materias = await response.json();
	console.log(materias);
  materiasCursadasArrayToHTML(materias.cursadas)
  materiasDisponiblesArrayToHTML(materias.disponibles);
  materiasBloqueadasArrayToHTML(materias.bloqueadas);
};

let t = 1
function materiasCursadasArrayToHTML(cursadas){
  let materiasCursadasHTML = cursadas.map((materia) => materiaCursadaToHTML(materia));
	materiasCursadasHTML = materiasCursadasHTML.join("");
	document.getElementById("clasesCursadas").innerHTML = materiasCursadasHTML;
}

function materiaCursadaToHTML(materia){
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
            ${materia}
          </div>
          <div class="col"><b>Créditos</b> ${materia}</div>
        </div>
      </div>
    </div>
  </div>`
  t++;
  return materiaHTML;
}

function materiasDisponiblesArrayToHTML(disponibles){
  let materiasDisponiblesHTML = disponibles.map((materia) => materiaDisponibleToHTML(materia));
	materiasDisponiblesHTML = materiasDisponiblesHTML.join("");
	document.getElementById("clasesDisponibles").innerHTML = materiasDisponiblesHTML;
}

function materiaDisponibleToHTML(materia){
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
          ${materia}
          </div>
          <div class="col"><b>Créditos</b>  ${materia}</div>
        </div>
      </div>
    </div>
  </div>`;
  t++;
  return materiaHTML
}

function materiasBloqueadasArrayToHTML(bloqueadas){
  console.log(bloqueadas);
  let materiasBloqueadasHTML = bloqueadas.map((materia) => materiaBloqueadaToHTML(materia));
	materiasBloqueadasHTML = materiasBloqueadasHTML.join("");
  console.log(materiasBloqueadasHTML);
	document.getElementById("clasesBloqueadas").innerHTML = materiasBloqueadasHTML;
  console.log(document.getElementById("clasesBloqueadas"));
}

function materiaBloqueadaToHTML(materia){
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
          ${materia}
          </div>
          <div class="col"><b>Créditos</b>  ${materia}</div>
        </div>
      </div>
    </div>
  </div>`;
  t++;
  return materiaHTML
}