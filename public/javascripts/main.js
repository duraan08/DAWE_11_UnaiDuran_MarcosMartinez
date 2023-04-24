window.onload = function() {
    let delete_links = document.getElementsByClassName("deleteUser");
    for (let item of delete_links) {
        item.addEventListener("click", deleteUser);
    }
    var edit_links = document.getElementsByClassName("editUser");
    for (let item of edit_links) {
        console.log(item);
        item.addEventListener("click", mostrarEditar);
    }
}

function deleteUser(event){
    var confirmation = confirm('Are You Sure?');
    if(confirmation){
        var url = '/users/delete/' + event.target.getAttribute('data-id');
        var consulta = new XMLHttpRequest();
        consulta.open("DELETE", url);
        consulta.onload = function() {
            if (consulta.status == 200) {
                window.location.replace('/')
            }
        };
        consulta.send();
    } else {
        return false;
    }

}

function mostrarEditar(){
    //var id=this.dataset.id;
    var id = event.target.getAttribute('data-id');
    url= '/users/find/' + id; // con esto obtengo los datos del usuario en mongodb
    document.getElementById("form").action = "/users/update/" + id; // para mas tarde llamar a actualizar al pulsar el boton "Edit"
    fetch(url, {
        method: 'POST',
    }).then(function (response) {
        return response.json();
    }).then(function(r){
        // Cargo los tres campos en el formulario
        document.getElementById("form").elements["first_name"].value = r[0].first_name;
        document.getElementById("form").elements["last_name"].value = r[0].last_name;
        document.getElementById("form").elements["email"].value = r[0].email;
        document.getElementById("form").elements["submit"].value = "Edit"
        //document.getElementById("first_name").value = r[0].first_name;
        //document.getElementById("last_name").value = r[0].last_name;
        //document.getElementById("email").value = r[0].email;
        //document.getElementById("submit").value = "Editar"; // Modifico el texto del boton submit
    });

}