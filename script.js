let christmasWords = [];
let usedWords = new Set(); // Usaremos un Set para evitar palabras repetidas

const wordDisplay = document.getElementById("word-display");
const imgDisplay = document.getElementById("img-display");
const wordHistoryList = document.getElementById("word-history-container");
const newWordButton = document.getElementById("new-word-btn");
const resetButton = document.getElementById("reset-btn");

let wordHistory = [];

// Cargar palabras desde el archivo JSON
async function loadWords() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    christmasWords = data.christmasWords;

    loadHistoryFromLocalStorage(); // Cargar historial desde localStorage
    updateHistory(); // Mostrar historial en la página
  } catch (error) {
    console.error("Error loading words:", error);
  }
}

// Generar una palabra aleatoria sin repetición
function getRandomWord() {
  const availableWords = christmasWords.filter((word) => !usedWords.has(word));

  if (availableWords.length === 0) {
    wordDisplay.textContent = "TODAS LAS PALABRAS HAN SALIDO!";
    newWordButton.disabled = true; // Deshabilitar el botón
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const newWord = availableWords[randomIndex];

  usedWords.add(newWord); // Marcar la palabra como usada
  wordDisplay.textContent = newWord;
  imgDisplay.src = `./assets/${newWord
    .toLowerCase()
    .replaceAll(" ", "_")}.jpeg`;
  imgDisplay.alt = `Imagen de ${newWord.toLowerCase()}`;
  wordHistory.push(newWord);
  saveHistoryToLocalStorage(); // Guardar el historial actualizado
  updateHistory();
}

// Restablecer todo
function resetEverything() {
  wordDisplay.textContent = "Presiona el botón!";
  imgDisplay.src = "./assets/bingo.jpeg";
  imgDisplay.alt = "Imagen de Bingo";
  wordHistory = [];
  usedWords.clear(); // Limpiar las palabras usadas
  newWordButton.disabled = false; // Habilitar el botón
  localStorage.removeItem("wordHistory"); // Eliminar el historial del localStorage
  updateHistory();
}

function updateHistory() {
  wordHistoryList.innerHTML = "";
  wordHistory.forEach((word) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "word-history-container";
    itemContainer.style.cssText = `
            margin: 10px;
            padding: 10px 10px 0;
            border-radius: 8px;
            background-color: #f5f5f5;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

    // Agregar el event listener para el clic
    itemContainer.addEventListener("click", function () {
      this.classList.toggle("selected-container");

      if (this.classList.contains("selected-container")) {
        const currentWord = this.innerText;
        wordDisplay.textContent = currentWord;
        imgDisplay.src = `./assets/${currentWord
          .toLowerCase()
          .replaceAll(" ", "_")}.jpeg`;
        imgDisplay.alt = `Imagen de ${currentWord.toLowerCase()}`;
      }
    });

    const img = document.createElement("img");
    img.src = `./assets/${word.toLowerCase().replaceAll(" ", "_")}.jpeg`;
    img.alt = `Imagen de ${word.toLowerCase()}`;
    img.width = 100;
    img.height = 100;
    img.className = "word-img";
    img.style.cssText = `object-fit: cover;`;

    const p = document.createElement("p");
    p.className = "word-display";
    p.textContent = word;
    p.style.cssText = `
            margin: 0;
            font-size: 1.1em;
            color: #333;
        `;

    // Agregar elementos al contenedor del item
    itemContainer.appendChild(img);
    itemContainer.appendChild(p);

    // Agregar el item al contenedor principal
    wordHistoryList.appendChild(itemContainer);
  });
}

// Guardar el historial en localStorage
function saveHistoryToLocalStorage() {
  localStorage.setItem("wordHistory", JSON.stringify(wordHistory));
}

// Cargar el historial desde localStorage
function loadHistoryFromLocalStorage() {
  const savedHistory = JSON.parse(localStorage.getItem("wordHistory") || "[]");
  wordHistory = savedHistory;
  usedWords = new Set(savedHistory); // Marcar palabras cargadas como usadas
}

// Event Listeners
newWordButton.addEventListener("click", getRandomWord);
resetButton.addEventListener("click", resetEverything);

// Cargar las palabras al iniciar
loadWords();
