let dir = "http://localhost:3000";

function validarCamposLogin() {}

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
		let response = await fetch(dir + "/api/login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userForLogin),
		});

		if (response.status == 200) {
			let data = await response.json();

			// Guardar en sessionStorage el token recibido y el email de usuario
			sessionStorage.token = data.token;
			sessionStorage.email = email;
		} else if (response.status == 404) {
			document.getElementById(
				"loginAlerts"
			).innerHTML = `<div class="alert alert-danger" role="alert">
            				<strong>No se pudo iniciar sesión. Verifica tu correo y contraseña</strong>
        				</div>`;
		}
	} else {
		// Si no estaban llenos los campos, mostrar alert
		document.getElementById(
			"loginAlerts"
		).innerHTML = `<div class="alert alert-secondary" role="alert">
            				<strong>Ingresa tu correo y contraseña</strong>
        				</div>`;
		return;
	}
});
