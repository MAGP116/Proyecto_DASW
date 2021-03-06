
// Borrar campos en cuanto se cargue la ventana
window.onload = async function () {
	document.getElementById("loginEmail").value = "";
	document.getElementById("loginPassword").value = "";

	document.getElementById("registerNombre").value = "";
	document.getElementById("registerApellido").value = "";
	document.getElementById("registerExpediente").value = "";
	document.getElementById("registerEmail").value = "";
	document.getElementById("registerPassword1").value = "";
	document.getElementById("registerPassword2").value = "";
};

// Para hacer login
document.getElementById("loginSubmit").addEventListener("click", async (ev) => {
	ev.preventDefault();

	let email = document.getElementById("loginEmail").value;
	let password = document.getElementById("loginPassword").value;

	// Si ambos campos están escritos
	if (email && password) {
		let userForLogin = {
			correo: email,
			password,
		};

		console.log(userForLogin);

		// Request server to login
		let response = await fetch("./api/login", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(userForLogin),
		});

		if (response.status == 200) {
			let data = await response.json();

			// Guardar en sessionStorage el token recibido y el email de usuario
			sessionStorage.token = data.token;
			sessionStorage.email = email;

			// Checar si ya tiene primer login
			let responseAlumno = await fetch(
				"./api/alumnos/" + sessionStorage.email,
				{
					method: "GET",
					headers: {
						"x-auth": sessionStorage.token,
					},
				}
			);
			let alumno = await responseAlumno.json();
			console.log(alumno);

			// Redirigir en base a eso
			// Si no tiene dato de carrera, enviar a primer registro
			if (!alumno.carrera || alumno.carrera == "") {
				window.location.href = `./primerLogin`;
			} else {
				window.location.href = `./inicio`;
			}
		} else if (response.status == 404) {
			document.getElementById("loginAlerts").innerHTML = `
			<div class="alert alert-danger" role="alert">
            	<strong>No se pudo iniciar sesión. Verifica tu correo y contraseña.</strong>
    		</div>`;
		}
	} else {
		// Si no estaban llenos los campos, mostrar alert
		document.getElementById("loginAlerts").innerHTML = `
		<div class="alert alert-secondary" role="alert">
         	<strong>Ingresa tu correo y contraseña.</strong>
		</div>`;
		return;
	}
});

// Para registrarse
document
	.getElementById("registerSubmit")
	.addEventListener("click", async (ev) => {
		// ev.preventDefault();
		if (document.getElementById("registerForm").checkValidity() == false) {
			document.getElementById("registerForm").reportValidity();
			return;
		}

		let nombre = document.getElementById("registerNombre").value;
		let apellido = document.getElementById("registerApellido").value;
		let expediente = document.getElementById("registerExpediente").value;
		let email = document.getElementById("registerEmail").value;
		let password1 = document.getElementById("registerPassword1").value;
		let password2 = document.getElementById("registerPassword2").value;

		// Verificar que las contraseñas coincidan
		if (password1 != password2) {
			document.getElementById("registerAlerts").innerHTML = `
				<div class="alert alert-warning" role="alert">
					<strong>Las contraseñas no coinciden. Por favor verifiquelas.</strong>
				</div>`;
		} else {
			// Limpiar registerAlerts
			document.getElementById("registerAlerts").innerHTML = ``;

			let userForRegister = {
				nombre,
				apellido,
				matricula: expediente,
				correo: email,
				password: password1,
				confPassword: password2,
			};

			// Registrar al usuario
			let responseRegister = await fetch("./api/alumnos", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(userForRegister),
			});

			console.log(userForRegister);
			console.log(responseRegister);

			// Si el registro fue exitoso, hacer login y llevarlo a firstLogin
			if (responseRegister.status == 201) {
				// Hacer login
				let response = await fetch( "./api/login", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(userForRegister),
				});

				if (response.status == 200) {
					let data = await response.json();

					// Guardar en sessionStorage el token recibido y el email de usuario
					sessionStorage.token = data.token;
					sessionStorage.email = email;

					window.location.href = `./primerLogin`;
				} else {
					document.getElementById("registerAlerts").innerHTML = `
					<div class="alert alert-secondary" role="alert">
            			<strong>¡Oh no! No pudimos iniciar sesión automáticamente. Por favor intenta iniciar sesión manualmente.</strong>
        			</div>`;
				}
			} else if (responseRegister.status == 400) {
				document.getElementById("registerAlerts").innerHTML = `
				<div class="alert alert-danger" role="alert">
            		<strong>Hubo un problema con el registro. Verifica tus datos e intenta de nuevo.</strong>
    			</div>`;
			}
		}
	});
