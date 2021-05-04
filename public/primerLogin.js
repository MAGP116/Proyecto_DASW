'use strict'
function createMateriaMedia(nombre){
    return `
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">
            <button class="btn btn-link" type="button">
                ${nombre}
            </button>
        </h5>
    </div>
</div>
`
}

function createCareerMedia(nombre){
return `
<option>${nombre}</option>
`
}


//Cargar contenido
function loadPage() {

    
}


//Actualizá las materias en función de la carrera seleccionada
document.getElementById('carreraSelect').onselect = async ev =>{

}