const max = 6
const min = 0;
// Cargar calendarios del usuario
window.onload = async function () {
	createNavBar();
	// Recibir todos los calendarios del usuario
	let response = await fetch("./api/calendarios", {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let calendarios = await response.json();
	//console.log(response);
	//console.log(calendarios);

	// Pedir las materias de cada calendario para contar cuántas tiene
	let calendarInfo = [];
	for (const calendar of calendarios) {
		//console.log(calendar);

		calendarInfo.push(
			fetch("./api/calendarios/" + calendar._id, {
				method: "GET",
				headers: {
					"x-auth": sessionStorage.token,
				},
			})
		);
	}

	if (calendarInfo.length == 0) {
		document.getElementById("mensajeCalendarios").innerHTML += `
		<h1 class="text-center">Hola <i class="fa fa-smile-o" aria-hidden="true"></i></h1>
		<h4 class="text-center">Aún no tienes calendarios. ¡Crea uno nuevo para empezar!</h4>`;
	}

	for await (let calendar of calendarInfo) {
		let details = await calendar.json();
		let materias = details.clase.length;
		document.getElementById("albumCalendarios").innerHTML += `
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card mb-4 box-shadow">
				<img class="card-img-top"
					data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
					alt="Thumbnail [100%x225]" style="height: 225px; width: 100%; display: block"
					src="./img/CalendarThumbnail${Math.floor(Math.random()*max)}.JPG"
					data-holder-rendered="true" />
				<div class="card-body">
					<p class="card-text">${details.nombre}</p>
					<div class="d-flex justify-content-between align-items-center">
						<div class="btn-group">
							<button type="button" class="btn btn-sm btn-outline-secondary">
								<a href="./calendario?calendarId=${details._id}">ver</a>
							</button>
							<button type="button" class="btn btn-sm btn-outline-secondary">
								<a href="./crear?calendarId=${details._id}">editar</a>
							</button>
						</div>
						<small class="text-muted">${materias} materias</small>
					</div>
				</div>
			</div>
		</div>`;

	}
};

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
						<button id="logOffbtn" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar sesión</button>
              <button id="btnEditUserInfo" type="submit" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#editUserModal">Editar</button>
            </div>
          </form>
        </div>
      </div>   
    </div>
  </div>
  </div>`;
	document.getElementById("modalesUsuario").innerHTML = modalHTML;
	document.getElementById("logOffbtn").addEventListener("click", logOff);
	document
		.getElementById("btnEditUserInfo")
		.addEventListener("click", modalEditUserInfo);
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
	if (password && (password != confirmpassword || password == "")) {
		console.log("Contraseñas no válidas");
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

function createNavBar() {
	let buttons = [];
	buttons.push(
		createNavBarButtonModel(
			'<i class="fa fa-home" aria-hidden="true"></i> Página Principal',
			true
		)
	);

	buttons.push(createNavBarButtonModel('Mis materias',false,`./materias`));
	document.getElementById('navbar').innerHTML = buttons.join('');
}
function createNavBarButtonModel(name, current, url) {
	if (current == true)
		return `<li class="nav-item active"><a class="nav-link" href="#">${name}<span class="sr-only">(current)</span></a></li>`;
	return `<li class="nav-item"><a class="nav-link" href="${
		url || "#"
	}">${name}</a></li>`;
}
