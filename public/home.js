let dir = "http://localhost:3000";

window.onload = async function () {
	let response = await fetch(dir + "/api/calendarios", {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let calendarios = await response.json();
	console.log(response);
	console.log(calendarios);

	for (const calendar of calendarios) {
		console.log(calendar);
		document.getElementById("albumCalendarios").innerHTML += `
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card mb-4 box-shadow">
				<img class="card-img-top"
					data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
					alt="Thumbnail [100%x225]" style="height: 225px; width: 100%; display: block"
					src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22328%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20328%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_178e6fd79bf%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_178e6fd79bf%22%3E%3Crect%20width%3D%22328%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.0859375%22%20y%3D%22119.7%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
					data-holder-rendered="true" />
				<div class="card-body">
					<p class="card-text">${calendar.nombre}</p>
					<div class="d-flex justify-content-between align-items-center">
						<div class="btn-group">
							<button type="button" class="btn btn-sm btn-outline-secondary">
								<a href="./detalleCalendario.html?calendarId=${calendar._id}">ver</a>
							</button>
							<button type="button" class="btn btn-sm btn-outline-secondary">
								<a href="./crearCalendario.html?calendarId=${calendar._id}">editar</a>
							</button>
						</div>
						<small class="text-muted"># materias • # créditos</small>
					</div>
				</div>
			</div>
		</div>`;
	}
};

//----------------------navegation Bar--------------------------------------
document.getElementById("userbtn").addEventListener("click", modalUserInfo);

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
