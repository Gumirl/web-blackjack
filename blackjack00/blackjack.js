const playerName = prompt(" INICIAR JUEGO \nDime tu nombre:");

document.getElementById("player-name").textContent =
  playerName?.trim() || "Jugador Legendario";

const cardValues = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
};

const deck = {
  cards: [],
  initialize() {
    const suits = ["♠", "♣", "♥", "♦"];
    this.cards = [];
    for (let suit of suits) {
      for (let value in cardValues) {
        this.cards.push({ value, suit });
      }
    }
    this.shuffle();
  },
  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  },
  drawCard() {
    return this.cards.pop();
  },
};

const dealer = { points: 0, hand: [] };
const player = { points: 0, hand: [] };

function calculatePoints(hand) {
  return hand.reduce((sum, card) => sum + cardValues[card.value], 0);
}

function displayHand(person, hand) {
  const container = document.getElementById(`${person}-cards`);
  container.innerHTML = "";

  hand.forEach((card) => {
    let imagen = document.createElement("img");

    const suitMap = { "♠": "T", "♣": "P", "♥": "C", "♦": "D" };
    const suitLetter = suitMap[card.suit];

    imagen.src = `img/${card.value}${suitLetter}.png`;
    imagen.alt = `${card.value}${card.suit}`;
    imagen.style.width = "100px";
    imagen.style.margin = "20px";
    +container.appendChild(imagen);
  });

  document.getElementById(`${person}-points`).textContent =
    calculatePoints(hand);
}

function checkWinner() {
  const playerPoints = player.points;
  const dealerPoints = dealer.points;
  const result = document.getElementById("result");

  if (playerPoints > 21) result.textContent = "Perdiste, te pasaste de 21.";
  else if (dealerPoints > 21)
    result.textContent = "¡Ganaste! La banca se pasó de 21.";
  else if (playerPoints === 21 && dealerPoints === 21)
    result.textContent = "Empate a 21.";
  else if (playerPoints === 21)
    result.textContent = "¡Blackjack! Ganaste con 21.";
  else if (dealerPoints === 21) result.textContent = "La banca ganó con 21.";
  else if (playerPoints > dealerPoints)
    result.textContent = "¡Ganaste! Te acercaste más a 21.";
  else if (playerPoints < dealerPoints) result.textContent = "La banca ganó.";
  else result.textContent = "Empate.";
}

// Función para que la banca juegue automáticamente hasta 17 puntos
function dealerTurn() {
  while (dealer.points < 17) {
    const card = deck.drawCard();
    dealer.hand.push(card);
    dealer.points = calculatePoints(dealer.hand);
    displayHand("dealer", dealer.hand);
  }
  if (dealer.points >= 22) {
    document.getElementById("result").textContent =
      "¡Ganaste! La banca se pasó de 21.";
  } else {
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
  }
}

// Funciones para los botones del jugador
function playerHit() {
  const card = deck.drawCard();
  player.hand.push(card);
  player.points = calculatePoints(player.hand);
  displayHand("player", player.hand);

  if (player.points >= 21) {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    checkWinner();
  }
}

function playerStand() {
  document.getElementById("hit").disabled = true;
  document.getElementById("stand").disabled = true;
  checkWinner();
}

// Iniciar el juego
function startGame() {
  deck.initialize();
  dealer.hand = [];
  player.hand = [];
  dealer.points = 0;
  player.points = 0;
  document.getElementById("result").textContent = "";

  dealerTurn();
}

// Eventos de los botones
document.getElementById("hit").addEventListener("click", playerHit);
document.getElementById("stand").addEventListener("click", playerStand);

// Iniciar el juego al cargar
startGame();
