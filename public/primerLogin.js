function createMateriaMedia(nombre){
    return `
<div class="card">
    <div class="card-header" id="headingOne">
        <h5 class="mb-0">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseMicros"aria-expanded="true" aria-controls="collapseMicros">
                ${nombre}
            </button>
        </h5>
    </div>
</div>
`
}

function createCarrerMedia(nombre){
return `
<option>${nombre}</option>
`
}

//Cargar contenido


//Actualizá las materias en función de la carrera seleccionada
document.getElementById('carreraSelect').onselect = async ev =>{

}