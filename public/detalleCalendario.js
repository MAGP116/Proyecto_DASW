if(!sessionStorage.token || sessionStorage.token && sessionStorage.token == undefined)window.location.href = `.`;
const urlParams = new URLSearchParams(window.location.search);
const calendarId = urlParams.get("calendarId");
let email;

//----------------------navegation Bar--------------------------------------
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
//----------------------------------------------------------------------------

window.onload = async function () {
	createNavBar();
	let response = await fetch(`./api/calendarios/${calendarId}`, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let calendar = await response.json();
	if(calendar.alumno == sessionStorage.email){
		document.getElementById('buttonEditar').removeAttribute('disabled')
		document.getElementById('buttonCompartir').removeAttribute('disabled')
		document.getElementById('buttonBorrar').removeAttribute('disabled')
	}
	email = calendar.alumno;
	setClases(calendar.clase);
	document.getElementById("calendarNameInput").value = calendar.nombre;
	document
		.getElementById("buttonCompartir")
		.addEventListener("click", function (ev) {
			var aux = document.createElement("input");
			aux.setAttribute("value", `https://proyectodaswmagp.herokuapp.com/calendario?calendarId=${calendarId}`);
			document.body.appendChild(aux);
			aux.select();
			document.execCommand("copy");
			document.body.removeChild(aux);
			ev.preventDefault();
		});

	document
		.getElementById("buttonBorrar")
		.addEventListener("click", function (ev) {
			toggleEraseModal();
		});
};

function toggleEraseModal() {
	document.getElementById(
		"modalBorrar"
	).innerHTML = `<div class="modal left fade user" id="modalBorrarrr" tabindex="" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header" style="padding-bottom: 0;">
        <h3>Borrar Calendario</h3>
      </div>
      <div class="modal-body">
        <div class="nav flex-sm-column flex-row">
          <form id="form_registro">
            <p>??Seguro que deseas borrar el calendario?
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              <button id="btnborrarCalendar" type="button" class="btn btn-danger" data-dismiss="modal" data-toggle="modal" data-target="#editUserModal">Borrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>`;
	document
		.getElementById("btnborrarCalendar")
		.addEventListener("click", confirmBorrar);
	$("#modalBorrarrr").modal("toggle");
}

async function confirmBorrar() {
	let response = await fetch(`./api/calendarios/${calendarId}`, {
		method: "DELETE",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	//let state = await response.json();
	//console.log(state);
	window.location.href = `./inicio`;
}

async function setClases(clasesArray) {
	let clasesHTML = [];
	//console.log(clasesArray);
	for (let i = 0; i < clasesArray.length; i++) {
		let string = await addClaseColumna(clasesArray[i]);
		clasesHTML.push(string);
		addClaseCalendar(clasesArray[i]);
	}
	clasesHTML = clasesHTML.join("");
	document.getElementById("accordionClases").innerHTML = clasesHTML;
}

let t = 0;
let creditos = 0;
let numberMaterias = 0;
async function addClaseColumna(clase) {
	//console.log(clase);
	let response = await fetch(`./api/clases`, {
		method: "GET",
		headers: {
			clase: clase,
		},
	});
	//console.log(response);
	numberMaterias++;
	let claseDetails = await response.json();
	response = await fetch(`./api/materias/` + claseDetails[0].materia, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let materiaDetails = await response.json();
	creditos += materiaDetails.creditos;
	let tableRowString = ``;
	for (let i = 0; i < claseDetails[0].sesion.length; i++) {
		let dia =
			claseDetails[0].sesion[i].dia == "LUN"
				? "Lunes"
				: claseDetails[0].sesion[i].dia == "MAR"
				? "Martes"
				: claseDetails[0].sesion[i].dia == "MIE"
				? "Miercoles"
				: claseDetails[0].sesion[i].dia == "JUE"
				? "Jueves"
				: claseDetails[0].sesion[i].dia == "VIE"
				? "Viernes"
				: "S??bado";
		tableRowString += `<tr style="margin-top: 0px;">
      <td style="margin-bottom: 0px; padding-top:  0px;"><p style="margin-bottom: 0px; padding: 0px;"><b>${dia}</b></p></td>
      <td style="margin-bottom: 0px; padding: 0px;"><p style="margin-left: 30px; margin-bottom: 0px; padding: 0px;">${claseDetails[0].sesion[i].horaInicio}:00 - ${claseDetails[0].sesion[i].horaFinal}:00</p></td>
    </tr>`;
	}
	let materiaHTML = `<div class="card">
    <div class="card-header" id="headingOne">
      <h5 class="mb-0">
      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${t}"
      aria-expanded="true" aria-controls="collapse${t}">
          ${claseDetails[0].materia}
        </button>
      </h5>
    </div>
    <div id="collapse${t}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionClases">
      <div class="card-body">
        <table class="table-borderless">
          ${tableRowString}
        </table>
        <p style="margin-top: 15px;"><b>${claseDetails[0].profesor}</b></p>
      </div>
    </div>
  </div>`;
	t++;
	document.getElementById("CreditosP").innerHTML = creditos;
	document.getElementById("NumMateriasP").innerHTML = numberMaterias;
	return materiaHTML;
}

async function addClaseCalendar(clase) {
	let response = await fetch(`./api/clases`, {
		method: "GET",
		headers: {
			clase: clase,
		},
	});
	let claseDetails = await response.json();
	for (let i = 0; i < claseDetails[0].sesion.length; i++) {
		let htmlString = `<small>${claseDetails[0].materia}</small>`;
		let dia = claseDetails[0].sesion[i].dia;
		let inicio = claseDetails[0].sesion[i].horaInicio;
		let element = document
			.getElementById(inicio)
			.getElementsByClassName(dia)[0];
		element.innerHTML = htmlString;
		element.classList.add("activo");
	}
}

function createNavBar() {
	let buttons = [];
	buttons.push(
		createNavBarButtonModel(
			'<i class="fa fa-home" aria-hidden="true"></i> P??gina Principal',
			false,
			`./inicio`
		)
	);
	buttons.push(
		createNavBarButtonModel("Mis materias", false, `./materias`)
	);
	document.getElementById("navbar").innerHTML = buttons.join("");
}
function createNavBarButtonModel(name, current, url) {
	if (current == true)
		return `<li class="nav-item active"><a class="nav-link" href="#">${name}<span class="sr-only">(current)</span></a></li>`;
	return `<li class="nav-item"><a class="nav-link" href="${
		url || "#"
	}">${name}</a></li>`;
}



document.getElementById('buttonEditar').onclick = ev=>{
	window.location.href = `./crear?calendarId=${calendarId}`;
}
