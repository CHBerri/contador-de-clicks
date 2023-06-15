const num = document.getElementById("numero");
const boton = document.querySelector(".btn");
const timer = document.getElementById("timer");
const ventana = document.querySelector(".ventana-records");
const reintentar = document.querySelector(".retry");
const guardar = document.querySelector(".save-name");
const nombre = document.getElementById("name");
const ventanaRegistro = document.querySelector(".registro");
const agregarRecord = document.getElementById("aquiVanLosRecords");
const empezar = document.querySelector(".start-game");

let listaRecords = []

let [segundos, minutos, milisegundos] = [0,0,0];   // los valores del arreglo se asignan respectivamente a las 3 variables

let contador = 0;

function guardarenLocalStorage() {
    localStorage.setItem("RecordList", JSON.stringify(listaRecords))
}

function tomardelLocalStorage () {

    if(localStorage.getItem("RecordList")) {
        let arr = localStorage.getItem("RecordList")
        listaRecords = JSON.parse(arr)
    }

    } 

function creaRegistro(nuevoRecord) {

    listaRecords.push(nuevoRecord)

    listaRecords.sort(function (a, b) {
        return b.puntos - a.puntos
    })

    const recordList = document.getElementById("lista-de-records")

    recordList.innerHTML = ""

    listaRecords.forEach(function(record) {
        let li = document.createElement("li")
        li.textContent = record.nombre + record.dots + record.puntos
        recordList.appendChild(li)
    })

    guardarenLocalStorage()

}


/* -----------------------------  Guarda el nombre de la persona  ------------------------------------------------------ */  

function guardarRegistro() {
    empezar.style.display = "block"
    ventanaRegistro.classList.add("esconder");
    tomardelLocalStorage();
}

guardar.addEventListener("click", guardarRegistro);


/* -----------------------------  Se reiniciar el juego al dar clic en el boton volver a intentar  -------------------------- */  

function reiniciarJuego() {
    ventana.classList.remove("mostrar-ventana");
    ventanaRegistro.classList.remove("esconder")
    boton.addEventListener("click", sumarClicks);
    contador = 0;
    num.textContent = contador;
}

reintentar.addEventListener("click", reiniciarJuego);


/* -----------------------------  Boton que suma los clicks en la variable contador  ---------------------------------------- */  

function sumarClicks() {
    if(timer.textContent != "00:00:00") {
        contador++;
        num.textContent = contador;
    }
}

boton.addEventListener("click", sumarClicks);


/* -----------------------------  Funcion que crea los labels con los nombres y puntajes  ---------------------------------------- */  

function actualizarRecord() {
    let registrar = ""
    let puntos = "."
    let name = nombre.value
    let puntaje = contador

    while(registrar.length < 30) {
        registrar = name.concat(puntos, puntaje.toString()) 
        puntos += '.'
    }

    let nuevoRecord = {
        nombre: name.toUpperCase(),
        dots: puntos,
        puntos: puntaje
    };

    if (listaRecords.length < 5) {
        creaRegistro(nuevoRecord)

    } else if(listaRecords.some(indice => indice.nombre === nuevoRecord.nombre)) {

        listaRecords = listaRecords.filter(indice => indice.nombre !== nuevoRecord.nombre)
        creaRegistro(nuevoRecord)

    } else if (nuevoRecord.puntos > listaRecords[listaRecords.length - 1].puntos) {

        listaRecords.pop()
        creaRegistro(nuevoRecord)
    }

   

    nombre.value = ""
}

/* -----------------------------  Funcion que escucha cada vez que se da espacio para iniciar el timer  ------------------------------ */  

empezar.addEventListener("click", empiezaJuego);

function empiezaJuego() {
    empezar.style.display = "none"
    timer.style.display = "block"
    const iniciaTimer = setInterval(() => {
        
        let min = minutos < 10 ? "0" + minutos : minutos         
        let m = milisegundos < 10 ? "0" + milisegundos : milisegundos
        let s = segundos < 10 ? "0" + segundos : segundos

        if(milisegundos >= 99) {
            milisegundos = 0
            segundos += 1
        }

        timer.textContent = `${min}:${s}:${m}`
        milisegundos++;

        if(segundos === 15) {
            actualizarRecord();
            [segundos, minutos, milisegundos] = [0,0,0]
            boton.removeEventListener("click", sumarClicks)
            timer.style.display = "none"
            ventana.classList.add("mostrar-ventana")
            timer.textContent = "00:00:00"
            clearInterval(iniciaTimer)
        }   
    }, 10)
}
