let christmasWords = [];
let usedWords = new Set();
const wordDisplay = document.getElementById("word-display");
const imgDisplay = document.getElementById("img-display");
const wordHistoryList = document.getElementById("word-history-container");
const newWordButton = document.getElementById("new-word-btn");
const resetButton = document.getElementById("reset-btn");
const balotera = document.getElementById("balotera");
let wordHistory = [];

const modalOverlay = document.getElementById("modal-overlay");
const modalConfirm = document.getElementById("modal-confirm");
const modalCancel = document.getElementById("modal-cancel");

// Crear copos de nieve
function createSnowflakes() {
  const snowflakesContainer = document.getElementById("snowflakes");
  for (let i = 0; i < 50; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent = "❄";
    snowflake.style.left = Math.random() * 100 + "%";
    snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
    snowflake.style.animationDelay = Math.random() * 5 + "s";
    snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
    snowflakesContainer.appendChild(snowflake);
  }
}

// Cargar palabras desde el archivo JSON
async function loadWords() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    christmasWords = data.christmasWords;
    loadHistoryFromLocalStorage();
    updateHistory();
  } catch (error) {
    console.error("Error loading words:", error);
  }
}

// Generar una palabra aleatoria con animación
function getRandomWord() {
  const availableWords = christmasWords.filter((word) => !usedWords.has(word));

  if (availableWords.length === 0) {
    wordDisplay.textContent = "🎊 ¡TODAS LAS PALABRAS HAN SALIDO! 🎊";
    newWordButton.disabled = true;
    return;
  }

  // Animación de la balotera
  balotera.classList.add("spinning");
  newWordButton.disabled = true;

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const newWord = availableWords[randomIndex];

    usedWords.add(newWord);
    wordDisplay.textContent = newWord;
    imgDisplay.src = `./assets/${newWord
      .toLowerCase()
      .replaceAll(" ", "_")}.webp`;
    imgDisplay.alt = `Imagen de ${newWord.toLowerCase()}`;

    // Animación de rebote de la imagen
    imgDisplay.classList.add("bouncing");

    setTimeout(() => {
      imgDisplay.classList.remove("bouncing");
    }, 600);

    wordHistory.push(newWord);
    saveHistoryToLocalStorage();
    updateHistory();

    balotera.classList.remove("spinning");
    newWordButton.disabled = false;
  }, 4000);
}

// Restablecer todo
// function resetEverything() {
//   if (
//     confirm(
//       "¿Estás seguro que deseas reiniciar el juego? Se perderá todo el progreso."
//     )
//   ) {
//     wordDisplay.textContent = "🎅 ¡Presiona el botón! 🎅";
//     imgDisplay.src = "./assets/bingo.webp";
//     imgDisplay.alt = "Imagen de Bingo";
//     wordHistory = [];
//     usedWords.clear();
//     newWordButton.disabled = false;
//     localStorage.removeItem("wordHistory");
//     updateHistory();
//   }
// }

// Restablecer todo
function resetEverything() {
  modalOverlay.classList.add("active");
}

function confirmReset() {
  wordDisplay.textContent = "🎅 ¡Presiona el botón! 🎅";
  imgDisplay.src = "./assets/bingo.webp";
  imgDisplay.alt = "Imagen de Bingo";
  wordHistory = [];
  usedWords.clear();
  newWordButton.disabled = false;
  localStorage.removeItem("wordHistory");
  updateHistory();
  closeModal();
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

function updateHistory() {
  wordHistoryList.innerHTML = "";
  wordHistory.forEach((word) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "word-history-container";

    itemContainer.addEventListener("click", function () {
      // Remover selección previa
      document.querySelectorAll(".word-history-container").forEach((el) => {
        el.classList.remove("selected-container");
      });

      this.classList.add("selected-container");
      const currentWord = word;
      wordDisplay.textContent = currentWord;
      imgDisplay.src = `./assets/${currentWord
        .toLowerCase()
        .replaceAll(" ", "_")}.webp`;
      imgDisplay.alt = `Imagen de ${currentWord.toLowerCase()}`;
    });

    const img = document.createElement("img");
    img.src = `./assets/${word.toLowerCase().replaceAll(" ", "_")}.webp`;
    img.alt = `Imagen de ${word.toLowerCase()}`;
    img.className = "word-img";

    const p = document.createElement("p");
    p.textContent = word;

    itemContainer.appendChild(img);
    itemContainer.appendChild(p);
    wordHistoryList.appendChild(itemContainer);
  });

  wordHistoryList.scrollTop = wordHistoryList.scrollHeight;
}

function saveHistoryToLocalStorage() {
  localStorage.setItem("wordHistory", JSON.stringify(wordHistory));
}

function loadHistoryFromLocalStorage() {
  const savedHistory = JSON.parse(localStorage.getItem("wordHistory") || "[]");
  wordHistory = savedHistory;
  usedWords = new Set(savedHistory);
}

// Event Listeners
newWordButton.addEventListener("click", getRandomWord);
resetButton.addEventListener("click", resetEverything);
modalConfirm.addEventListener("click", confirmReset);
modalCancel.addEventListener("click", closeModal);

// Cerrar modal al hacer clic fuera de él
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Inicializar
createSnowflakes();
loadWords();
