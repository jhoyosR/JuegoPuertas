// script.js

let doors = [0, 0, 0]; // 0 para cabra, 1 para carro
let selectedDoor = null;
let revealedDoor = null;
let finalChoice = null;
let gameActive = true;
let resultados = []; // Array para almacenar los resultados de las partidas

function initializeGame() {
    doors = [0, 0, 0];
    doors[Math.floor(Math.random() * 3)] = 1; // Coloca el carro en una puerta aleatoria
    selectedDoor = null;
    revealedDoor = null;
    finalChoice = null;
    gameActive = true;
    document.getElementById('message').textContent = 'Escoge una puerta';
    document.querySelectorAll('.door').forEach(door => {
        door.style.backgroundColor = '#3498db';
        door.textContent = door.getAttribute('data-door');
        door.addEventListener('click', selectDoor);
    });
    // Deshabilitar los botones de acción hasta que se elija una puerta
    toggleActionButtons(false);
}

function toggleActionButtons(enable) {
    document.getElementById('stay').disabled = !enable;
    document.getElementById('switch').disabled = !enable;
}

function selectDoor(event) {
    if (!gameActive) return;

    selectedDoor = parseInt(event.target.getAttribute('data-door'));
    revealGoat();
}

function revealGoat() {
    do {
        revealedDoor = Math.floor(Math.random() * 3) + 1;
    } while (revealedDoor === selectedDoor || doors[revealedDoor - 1] === 1);

    document.getElementById(`door${revealedDoor}`).style.backgroundColor = '#FFC107';
    document.getElementById(`door${revealedDoor}`).textContent = 'Cabra';

    document.getElementById('message').textContent = '¿Quieres quedarte con tu elección o cambiar de puerta?';
    toggleActionButtons(true);
}

function stayWithChoice() {
    if (!gameActive) return;

    finalChoice = selectedDoor;
    revealResult();
}

function switchChoice() {
    if (!gameActive) return;

    finalChoice = 6 - selectedDoor - revealedDoor; // La puerta que no es ni la seleccionada ni la revelada
    revealResult();
}

function revealResult() {
    gameActive = false;
    toggleActionButtons(false);
    document.querySelectorAll('.door').forEach(door => {
        door.removeEventListener('click', selectDoor);
        let doorNumber = parseInt(door.getAttribute('data-door'));
        if (doors[doorNumber - 1] === 1) {
            door.style.backgroundColor = '#28A745';
            door.textContent = 'Carro';
        } else {
            door.style.backgroundColor = '#FFC107';
            door.textContent = 'Cabra';
        }
    });

    let gano = (doors[finalChoice - 1] === 1);
    let cambio = (selectedDoor !== finalChoice);
    
    registrarResultado(cambio, gano);

    if (gano) {
        document.getElementById('message').textContent = '¡Ganaste el carro!';
    } else {
        document.getElementById('message').textContent = 'Lo siento, obtuviste una cabra.';
    }
}

function registrarResultado(cambio, gano) {
    let resultado = { cambio: cambio, gano: gano };
    resultados.push(resultado);
}

function simularJuegos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
        // Inicializa la configuración del juego
        doors = [0, 0, 0];
        doors[Math.floor(Math.random() * 3)] = 1;

        // Elige una puerta al azar
        selectedDoor = Math.floor(Math.random() * 3) + 1;

        // Revela una puerta con una cabra
        do {
            revealedDoor = Math.floor(Math.random() * 3) + 1;
        } while (revealedDoor === selectedDoor || doors[revealedDoor - 1] === 1);

        // Decide si cambiar de puerta o no (simulación: 50% de probabilidad de cambiar)
        let cambiar = Math.random() < 0.5;
        finalChoice = cambiar ? 6 - selectedDoor - revealedDoor : selectedDoor;

        // Registrar el resultado de esta simulación
        let gano = (doors[finalChoice - 1] === 1);
        registrarResultado(cambiar, gano);
    }
    console.log(resultados);
}

// Inicializa el juego al cargar la página
initializeGame();

document.getElementById('reset').addEventListener('click', initializeGame);
document.getElementById('stay').addEventListener('click', stayWithChoice);
document.getElementById('switch').addEventListener('click', switchChoice);
document.getElementById('simulate').addEventListener('click', () => simularJuegos(100));
