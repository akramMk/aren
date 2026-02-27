// Clic sur le cœur principal
const heartButton = document.getElementById("heartButton");
const sectionAccueil = document.getElementById("section-accueil");
const sectionSurprise = document.getElementById("section-surprise");

const floatingHeartsContainer = document.querySelector(".floating-hearts-container");

// Musique
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicPlaying = false;

// Mini-jeu : collecte de cœurs
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

// Boîte à vœux
const wishInput = document.getElementById("wishInput");
const sendWishBtn = document.getElementById("sendWish");
const wishDisplay = document.getElementById("wishDisplay");

// Message d'amour avec effet d'écriture
const typedTextElement = document.getElementById("typedText");
const textToType = `

Joyeux anniversaire mon amour 💖🎂 Aujourd’hui 
est un jour particulier qui me donne envie de te rappeler combien tu comptes pour moi. 
Depuis que tu es entré dans ma vie, chaque jour est un conte de fées, une source de bonheur et de joie. 
Ton sourire illumine mes journées et ton amour réchauffe mon cœur ❤️. 
Je suis tellement reconnaissante de t’avoir à mes côtés. J’espère que ta journée d’anniversaire se passera à merveille.
Que cette année t’apporte autant de bonheur que tu m’en donnes chaque jour. Je t’aime plus que tout 💕.
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

    // Effet feu d'artifice (confetti)
    if (typeof confetti === "function") {
      // Explosion centrale
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 }
      });

      // Feu d'artifice gauche
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 100,
        origin: { x: 0, y: 0.7 }
      });

      // Feu d'artifice droite
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 100,
        origin: { x: 1, y: 0.7 }
      });
    }
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

// Mini-jeu : collecte de cœurs
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

   // Petit effet de célébration à la fin du jeu
   if (typeof confetti === "function") {
     const baseOptions = {
       spread: 90,
       origin: { y: 0.7 }
     };

     // Premier burst
     confetti({
       ...baseOptions,
       particleCount: 80,
       colors: ["#ff9a9e", "#fecfef", "#f6e7ff"]
     });

     // Second burst légèrement décalé
     setTimeout(() => {
       confetti({
         ...baseOptions,
         particleCount: 60,
         colors: ["#ff6a88", "#ffc371", "#ffffff"]
       });
     }, 300);
   }
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", startGame);
}

// Deuxième jeu : Remplis le cœur d'amour
const game2Fill = document.getElementById("game2Fill");
const game2ClicksEl = document.getElementById("game2Clicks");
const game2HeartBtn = document.getElementById("game2Heart");
const game2Message = document.getElementById("game2Message");
const game2Reset = document.getElementById("game2Reset");

const GAME2_TARGET = 15;
let game2Clicks = 0;

function updateGame2() {
  if (!game2ClicksEl || !game2Fill) return;
  game2ClicksEl.textContent = String(game2Clicks);
  const pct = Math.min(100, (game2Clicks / GAME2_TARGET) * 100);
  game2Fill.style.width = pct + "%";

  if (game2Clicks >= GAME2_TARGET) {
    if (game2HeartBtn) {
      game2HeartBtn.classList.add("done");
      game2HeartBtn.textContent = "💖";
    }
    if (game2Message) {
      game2Message.textContent = "Nhbeek, Je t'aime, Seni seviyorum, Ti amo ! 💞";
    }
    if (game2Reset) {
      game2Reset.classList.remove("hidden");
    }
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.75 },
        colors: ["#ff9a9e", "#ff6a88", "#ffe0e8"]
      });
    }
  }
}

if (game2HeartBtn) {
  game2HeartBtn.addEventListener("click", () => {
    if (game2Clicks >= GAME2_TARGET) return;
    game2Clicks++;
    updateGame2();
  });
}

if (game2Reset) {
  game2Reset.addEventListener("click", () => {
    game2Clicks = 0;
    if (game2Fill) game2Fill.style.width = "0%";
    if (game2HeartBtn) {
      game2HeartBtn.classList.remove("done");
      game2HeartBtn.textContent = "❤️";
    }
    if (game2Message) game2Message.textContent = "";
    game2Reset.classList.add("hidden");
    updateGame2();
  });
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