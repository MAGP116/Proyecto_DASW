let dir = 'http://localhost:3000'

//----------------------navegation Bar--------------------------------------
document.getElementById('userbtn').addEventListener('click', modalUserInfo);

async function modalUserInfo(){
  let response = await fetch(
   `${dir}/api/alumnos/` + sessionStorage.email,
   {
     method: "GET",
     headers: {
       "x-auth": sessionStorage.token,
     },
   }
  );
  let user = await response.json();
  let modalHTML = 
  `<div class="modal left fade user" id="userModal" tabindex="" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
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
              <button id="LogOff" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar sesión</button>
              <button id="btnEditUserInfo" type="submit" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#editUserModal">Editar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>`;
  document.getElementById("modalesUsuario").innerHTML = modalHTML
  document.getElementById('LogOff').addEventListener('click', logOff);
  document.getElementById('btnEditUserInfo').addEventListener('click', modalEditUserInfo);
  await $("#userModal").modal("toggle");
}

function logOff(){
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('email');
  window.location.href = "./index.html";
}

async function modalEditUserInfo(){
  let response = await fetch(
   `${dir}/api/alumnos/` + sessionStorage.email,
   {
     method: "GET",
     headers: {
       "x-auth": sessionStorage.token,
     },
   }
  );
  let user = await response.json();
  let modalHTML = 
  `<div class="modal left fade" id="editUserModal" tabindex="" role="dialog" aria-labelledby="userModalLabel"aria-hidden="true">
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
  document.getElementById("modalesUsuario").innerHTML = modalHTML
  document.getElementById('btnConfirmarEdicion').addEventListener('click', verifyPUT);
  await $("#editUserModal").modal("toggle");
}

async function verifyPUT(){
  let password = document.getElementById('passUpdate').value;
  let confirmpassword = document.getElementById('confpassUpdate').value;
  let nombre = document.getElementById('nomUpdate').value;
  let apellido = document.getElementById('apeUpdate').value;
  if(password != confirmpassword || password == '' ){
    console.log('Contraseñas no válidas');
    modalUserInfo();
  }else{
    let updatedUser = { nombre, apellido, password };
    let response = await fetch(
      `${dir}/api/alumnos/`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "x-auth": sessionStorage.token,
        },
        body: JSON.stringify(updatedUser),
      }
     );
  
     let user = await response.json();
     modalUserInfo();
  }
}
//----------------------------------------------------------------------------

window.onload =async function () {
	let response = await fetch(`${dir}/api/calendarios/${sessionStorage.calendar}`, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let calendar = await response.json();
  setClases(calendar.clase);
  document.getElementById("calendarNameInput").value = calendar.nombre;
  document.getElementById("buttonCompartir").addEventListener("click", function(ev){
    var aux = document.createElement("input");
    aux.setAttribute("value", "Aquí va el link de acceso");
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    ev.preventDefault()
  })

  document.getElementById("buttonBorrar").addEventListener("click",function(ev){
    toggleEraseModal()
  });
}

function toggleEraseModal(){
  console.log('IN');
  document.getElementById("modalBorrar").innerHTML = 
  `<div class="modal left fade user" id="modalBorrarrr" tabindex="" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header" style="padding-bottom: 0;">
        <h3>Borrar Calendario</h3>
      </div>
      <div class="modal-body">
        <div class="nav flex-sm-column flex-row">
          <form id="form_registro">
            <p>¿Seguro que deseas borrar el calendario?
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
  document.getElementById("btnborrarCalendar").addEventListener("click", confirmBorrar);
  $("#modalBorrarrr").modal("toggle");
}

async function confirmBorrar(){
  let response = await fetch(`${dir}/api/calendarios/${sessionStorage.calendar}`, {
    method: "DELETE",
    headers: {
      "x-auth": sessionStorage.token,
    },
  });
  let state = await response.json();
  console.log(state);
}

async function setClases(clasesArray){
  let clasesHTML = [];
  for(let i = 0; i < clasesArray.length; i++){
    let string = await addClaseColumna(clasesArray[i])
    clasesHTML.push(string);
    addClaseCalendar(clasesArray[i]);
  }
	clasesHTML = clasesHTML.join("");
	document.getElementById("accordionClases").innerHTML = clasesHTML;
}

let t = 0;
let creditos = 0;
let numberMaterias = 0;
async function addClaseColumna(clase){
  let response = await fetch(`${dir}/api/clases`, {
		method: "GET",
		headers: {
      "clase": clase
		}
	});
  numberMaterias ++;
  let claseDetails = await response.json();
  response = await fetch(`${dir}/api/materias/`+claseDetails[0].materia, {
		method: "GET",
		headers: {
			"x-auth": sessionStorage.token,
		},
	});
	let materiaDetails = await response.json();
  creditos += materiaDetails.creditos
  let tableRowString = ``
  for (let i = 0; i < claseDetails[0].sesion.length;i++){
    let dia = (claseDetails[0].sesion[i].dia == 'LUN')? 'Lunes':
              (claseDetails[0].sesion[i].dia == 'MAR')? 'Martes':
              (claseDetails[0].sesion[i].dia == 'MIE')? 'Miercoles':
              (claseDetails[0].sesion[i].dia == 'JUE')? 'Jueves':
              (claseDetails[0].sesion[i].dia == 'VIE')? 'Viernes':
                                                        'Sábado';
    tableRowString += 
    `<tr style="margin-top: 0px;">
      <td style="margin-bottom: 0px; padding-top:  0px;"><p style="margin-bottom: 0px; padding: 0px;"><b>${dia}</b></p></td>
      <td style="margin-bottom: 0px; padding: 0px;"><p style="margin-left: 30px; margin-bottom: 0px; padding: 0px;">${claseDetails[0].sesion[i].horaInicio}:00 - ${claseDetails[0].sesion[i].horaFinal}:00</p></td>
    </tr>`
  }
  let materiaHTML = 
  `<div class="card">
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

async function addClaseCalendar(clase){
  let response = await fetch(`${dir}/api/clases`, {
		method: "GET",
		headers: {
      "clase": clase
		}
	});
  let claseDetails = await response.json();
  for (let i = 0; i < claseDetails[0].sesion.length;i++){
    let htmlString = `<small>${claseDetails[0].materia}</small>`;
    let dia = (claseDetails[0].sesion[i].dia)
    let inicio = (claseDetails[0].sesion[i].horaInicio)
    let element = document.getElementById(inicio).getElementsByClassName(dia)[0]
    element.innerHTML = htmlString;
    element.classList.add("activo");
  }
}
