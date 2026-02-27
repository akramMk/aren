// Clic sur le cœur principal
const heartButton = document.getElementById("heartButton");
const sectionAccueil = document.getElementById("section-accueil");
const sectionSurprise = document.getElementById("section-surprise");

const floatingHeartsContainer = document.querySelector(".floating-hearts-container");

// Musique
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicPlaying = false;

// Mini-jeu 1 : collecte de cœurs
const gameArea = document.getElementById("gameArea");
const startGameBtn = document.getElementById("startGame");
const scoreSpan = document.getElementById("score");
const timeSpan = document.getElementById("time");
const gameMessage = document.getElementById("gameMessage");
let gameInterval = null;
let timerInterval = null;
let score = 0;
let timeLeft = 15;
let gameRunning = false;

// Mini-jeu 2 : quiz d'amour
const quizQuestionEl = document.getElementById("quizQuestion");
const quizOptionsEl = document.getElementById("quizOptions");
const quizProgressEl = document.getElementById("quizProgress");
const quizMessageEl = document.getElementById("quizMessage");
const nextQuestionBtn = document.getElementById("nextQuestion");

const quizData = [
  {
    question: "Quand tu penses à nous deux, quel mot te vient le plus en tête ?",
    options: [
      "Magique ✨",
      "Confidence 🤍",
      "Fou rire 😂",
      "Destin 💫"
    ],
    reactions: [
      "Oui, magique… comme chaque moment avec toi. ✨",
      "La confiance qu’on a, c’est mon trésor. 🤍",
      "Nos fous rires sont mes médicaments préférés. 😂",
      "Je crois aussi que c’est le destin qui nous a mis ensemble. 💫"
    ]
  },
  {
    question: "Quel est ton moment préféré avec moi ?",
    options: [
      "Quand on parle pendant des heures 💬",
      "Quand on se regarde en silence 👀",
      "Quand on rigole pour rien 😆",
      "Juste quand tu es près de moi ❤️"
    ],
    reactions: [
      "Nos longues discussions… je ne les échangerais pour rien au monde. 💬",
      "Nos silences veulent souvent dire plus que mille mots. 👀",
      "On est vraiment deux enfants parfois, et j’adore ça. 😆",
      "Être près de toi, c’est déjà tout ce dont j’ai besoin. ❤️"
    ]
  },
  {
    question: "Si je pouvais t’offrir quelque chose maintenant, tu choisirais…",
    options: [
      "Un câlin infini 🤗",
      "Un voyage à deux 🌍",
      "Une nuit à regarder les étoiles 🌙",
      "Une lettre remplie de mots d’amour 💌"
    ],
    reactions: [
      "Un câlin infini, c’est aussi tout ce que je veux. 🤗",
      "Un voyage à deux… peu importe où, tant que c’est avec toi. 🌍",
      "Regarder les étoiles avec toi serait parfait. 🌙",
      "J’ai déjà envie de t’écrire mille lettres d’amour. 💌"
    ]
  }
];

let currentQuizIndex = 0;
let selectedOptionIndex = null;

// Boîte à vœux
const wishInput = document.getElementById("wishInput");
const sendWishBtn = document.getElementById("sendWish");
const wishDisplay = document.getElementById("wishDisplay");

// Message d'amour avec effet d'écriture
const typedTextElement = document.getElementById("typedText");
const textToType = `
Je t’aime plus que tout, Aren. 💖
Merci d’être dans ma vie, de me faire rire, de me comprendre, et de rendre chaque jour plus doux.
Joyeux anniversaire à la plus belle personne de mon univers. ❤️
Pour toujours : Kikou. 💫
`;
let typingIndex = 0;
const typingSpeed = 40; // ms par lettre

function startTyping() {
  if (!typedTextElement) return;

  function type() {
    if (typingIndex < textToType.length) {
      typedTextElement.textContent += textToType.charAt(typingIndex);
      typingIndex++;
      setTimeout(type, typingSpeed);
    }
  }

  type();
}

// Cœurs flottants en fond de la carte romantique
function createFloatingHeart() {
  if (!floatingHeartsContainer) return;

  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.textContent = "💖";

  const containerWidth = floatingHeartsContainer.offsetWidth;
  const randomLeft = Math.random() * containerWidth;
  const randomDuration = 4 + Math.random() * 3;

  heart.style.left = `${randomLeft}px`;
  heart.style.animationDuration = `${randomDuration}s`;
  floatingHeartsContainer.appendChild(heart);

  setTimeout(() => {
    floatingHeartsContainer.removeChild(heart);
  }, randomDuration * 1000 + 100);
}

let heartInterval = null;

function startFloatingHearts() {
  if (heartInterval) return;
  heartInterval = setInterval(createFloatingHeart, 700);
}

// Gestion du clic sur le cœur principal
if (heartButton) {
  heartButton.addEventListener("click", () => {
    sectionAccueil.classList.add("hidden");
    sectionSurprise.classList.remove("hidden");

    startTyping();
    startFloatingHearts();
  });
}

// Musique
if (musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (!bgMusic) return;

    try {
      if (!musicPlaying) {
        await bgMusic.play();
        musicPlaying = true;
        musicToggle.textContent = "Mettre la musique en pause";
      } else {
        bgMusic.pause();
        musicPlaying = false;
        musicToggle.textContent = "Lancer la musique";
      }
    } catch (err) {
      console.error("Erreur lors de la lecture de la musique :", err);
    }
  });
}

// Mini-jeu
function spawnHeart() {
  if (!gameRunning) return;

  const heart = document.createElement("div");
  heart.classList.add("game-heart");
  heart.textContent = "💗";

  const areaRect = gameArea.getBoundingClientRect();

  const size = 26 + Math.random() * 14;
  heart.style.fontSize = `${size}px`;

  const maxLeft = areaRect.width - size * 2;
  const maxTop = areaRect.height - size * 2;

  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;

  heart.style.left = `${left}px`;
  heart.style.top = `${top}px`;

  heart.addEventListener("click", () => {
    if (!gameRunning) return;
    score++;
    scoreSpan.textContent = String(score);
    heart.style.transform = "scale(0.4)";
    heart.style.opacity = "0";
    setTimeout(() => heart.remove(), 120);
  });

  gameArea.appendChild(heart);

  setTimeout(() => {
    if (gameArea.contains(heart)) {
      heart.remove();
    }
  }, 1400);
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  score = 0;
  timeLeft = 15;
  scoreSpan.textContent = "0";
  timeSpan.textContent = String(timeLeft);
  gameMessage.textContent = "";

  const oldHearts = gameArea.querySelectorAll(".game-heart");
  oldHearts.forEach((h) => h.remove());

  gameInterval = setInterval(spawnHeart, 550);

  timerInterval = setInterval(() => {
    timeLeft--;
    timeSpan.textContent = String(timeLeft);

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameInterval = null;
  timerInterval = null;

  const hearts = gameArea.querySelectorAll(".game-heart");
  hearts.forEach((h) => h.remove());

  let message = "";
  if (score === 0) {
    message = "Oh non, aucun cœur attrapé… mais tu as déjà tout mon cœur. 💖";
  } else if (score < 8) {
    message = `Tu as attrapé ${score} cœurs ! Chaque cœur = un "je t’aime". 💘`;
  } else {
    message = `Wow, ${score} cœurs ! C’est officiel : mon cœur t’appartient entièrement. 💞`;
  }

  gameMessage.textContent = message;
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", startGame);
}

// Mini-jeu 2 : quiz d'amour
function renderQuizQuestion() {
  if (!quizQuestionEl || !quizOptionsEl || !quizProgressEl) return;

  const current = quizData[currentQuizIndex];
  quizQuestionEl.textContent = current.question;

  quizOptionsEl.innerHTML = "";
  selectedOptionIndex = null;
  quizMessageEl.textContent = "";
  if (nextQuestionBtn) {
    nextQuestionBtn.disabled = true;
    nextQuestionBtn.textContent =
      currentQuizIndex === quizData.length - 1 ? "Voir le petit mot final" : "Question suivante";
  }

  current.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      // mettre à jour la sélection
      const all = quizOptionsEl.querySelectorAll(".quiz-option-btn");
      all.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedOptionIndex = index;

      const reaction = current.reactions[index];
      quizMessageEl.textContent = reaction;

      if (nextQuestionBtn) {
        nextQuestionBtn.disabled = false;
      }
    });
    quizOptionsEl.appendChild(btn);
  });

  quizProgressEl.textContent = `Question ${currentQuizIndex + 1} sur ${quizData.length}`;
}

function goToNextQuestion() {
  if (selectedOptionIndex === null) return;

  if (currentQuizIndex < quizData.length - 1) {
    currentQuizIndex++;
    renderQuizQuestion();
  } else {
    // fin du quiz
    quizQuestionEl.textContent = "Merci d’avoir joué à mon petit quiz d’amour. 💖";
    quizOptionsEl.innerHTML = "";
    quizProgressEl.textContent = "";
    quizMessageEl.textContent =
      "Peu importe tes réponses, la seule vraie réponse, c’est que je t’aime plus que tout. ❤️";
    if (nextQuestionBtn) {
      nextQuestionBtn.disabled = true;
      nextQuestionBtn.textContent = "C’est fini ♥";
    }
  }
}

if (nextQuestionBtn) {
  nextQuestionBtn.addEventListener("click", goToNextQuestion);
}

// Boîte à vœux
if (sendWishBtn) {
  sendWishBtn.addEventListener("click", () => {
    const text = wishInput.value.trim();
    if (!text) {
      wishDisplay.textContent = "Tu dois écrire quelque chose, petite coquine. 😘";
      return;
    }

    wishDisplay.textContent = `Ton message est bien arrivé dans mon cœur : « ${text} » 💌`;
    wishInput.value = "";
  });
}