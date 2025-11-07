const form = document.getElementById("alumnoForm");
const tabla = document.getElementById("tablaAlumnos");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
let editIndex = null;

// Mostrar datos
function renderTable() {
  tabla.innerHTML = "";
  alumnos.forEach((al, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${al.no_boleta}</td>
      <td>${al.nombre}</td>
      <td>${al.ap}</td>
      <td>${al.am}</td>
      <td>${al.edad}</td>
      <td>${al.carrera}</td>
      <td>
        <button class="btn-editar" onclick="editarAlumno(${i})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarAlumno(${i})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(tr);
  });
}

// Guardar alumno
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevo = {
    no_boleta: form.no_boleta.value.trim(),
    nombre: form.nombre.value.trim(),
    ap: form.ap.value.trim(),
    am: form.am.value.trim(),
    edad: form.edad.value.trim(),
    carrera: form.carrera.value.trim()
  };

  if (editIndex === null) {
    alumnos.push(nuevo);
  } else {
    alumnos[editIndex] = nuevo;
    editIndex = null;
    btnCancelar.hidden = true;
    btnGuardar.textContent = "Guardar";
  }

  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  form.reset();
  renderTable();
});

// Editar alumno
window.editarAlumno = function (i) {
  const al = alumnos[i];
  form.no_boleta.value = al.no_boleta;
  form.nombre.value = al.nombre;
  form.ap.value = al.ap;
  form.am.value = al.am;
  form.edad.value = al.edad;
  form.carrera.value = al.carrera;

  editIndex = i;
  btnGuardar.textContent = "Actualizar";
  btnCancelar.hidden = false;
};

// Eliminar alumno
window.eliminarAlumno = function (i) {
  if (confirm("¿Eliminar este alumno?")) {
    alumnos.splice(i, 1);
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    renderTable();
  }
};

// Cancelar edición
btnCancelar.addEventListener("click", () => {
  form.reset();
  editIndex = null;
  btnGuardar.textContent = "Guardar";
  btnCancelar.hidden = true;
});

renderTable();
