let players = [];
let history = [];
let playerScores = {};

function addPlayer() {
  const playerName = document.getElementById("player-name").value;
  if (playerName && !players.includes(playerName)) {
    players.push(playerName);
    displayPlayers();
    saveToLocalStorage();
  } else {
    alert("Tên người chơi đã tồn tại hoặc không hợp lệ!");
  }
  document.getElementById("player-name").value = "";
}

function displayPlayers() {
  const playerList = document.getElementById("player-list");
  playerList.innerHTML = "";
  players.forEach((player, index) => {
    const currentScore = getCurrentScore(player);
    const li = document.createElement("li");
    li.innerHTML = `<span><p style="width: 100px;">${player}</p> - <strong id="score-display-${player}">${currentScore}</strong></span>
                        <button class="btn danger" onclick="removePlayer(${index})">Xóa</button>`;
    playerList.appendChild(li);
  });
}

function getCurrentScore(player) {
  return playerScores[player] || 0;
}
function updatePlayerScores() {
  players.forEach((player) => {
    const currentScore = getCurrentScore(player);
    document.getElementById(`score-display-${player}`).textContent =
      currentScore;
  });
}

function removePlayer(index) {
  const playerName = players[index];

  const confirmation = confirm(
    `Bạn có chắc chắn muốn xoá người chơi "${playerName}"?`
  );

  if (confirmation) {
    players.splice(index, 1);
    displayPlayers();
    saveToLocalStorage();
  }
}

function clearAll() {
  const confirmation = confirm(`Bạn có chắc chắn muốn xoá tất cả ?`);

  if (confirmation) {
    players = [];
    history = [];
    playerScores = {};
    displayPlayers();
    displayHistory();
    saveToLocalStorage();
  }
}

function startGame() {
  if (players.length === 0) {
    alert("Hãy thêm ít nhất 1 người chơi!");
    return;
  }

  const popup = document.getElementById("score-popup");
  popup.style.display = "block";

  const scoreInputs = document.getElementById("score-inputs");
  scoreInputs.innerHTML = "";
  players.forEach((player) => {
    scoreInputs.innerHTML += `
            <div class="score-controls">
                <label for="score-${player}">${player}: </label>
                <button class="hide-on-mobile" onclick="adjustScore('${player}', -10)">-10</button>
                <button onclick="adjustScore('${player}', -5)">-5</button>
                <button onclick="adjustScore('${player}', -1)">-1</button>
                <input type="number" id="score-${player}" placeholder="Số tiền" value="0" class="neutral" oninput="updateColor('${player}'); updateTotalScore();">
                <button onclick="adjustScore('${player}', 1)">+1</button>
                <button onclick="adjustScore('${player}', 5)">+5</button>
                <button class="hide-on-mobile" onclick="adjustScore('${player}', 10)">+10</button>
            </div><br>
        `;
  });

  updateTotalScore();
}

function adjustScore(player, amount) {
  const scoreInput = document.getElementById(`score-${player}`);
  scoreInput.value = parseInt(scoreInput.value) + amount;
  updateColor(player);
  updateTotalScore();
}

function updateTotalScore() {
  let total = 0;
  players.forEach((player) => {
    const score =
      parseInt(document.getElementById(`score-${player}`).value) || 0;
    total += score;
  });
  document.getElementById("total-score").textContent = total;
}

function updateColor(player) {
  const scoreInput = document.getElementById(`score-${player}`);
  const value = parseInt(scoreInput.value);

  if (value > 0) {
    scoreInput.classList.remove("negative", "neutral");
    scoreInput.classList.add("positive");
  } else if (value < 0) {
    scoreInput.classList.remove("positive", "neutral");
    scoreInput.classList.add("negative");
  } else {
    scoreInput.classList.remove("positive", "negative");
    scoreInput.classList.add("neutral");
  }
}

function saveGame() {
  const scores = players.map((player) => {
    const score =
      parseInt(document.getElementById(`score-${player}`).value) || 0;
    return { player, score };
  });

  const total = scores.reduce((sum, player) => sum + player.score, 0);

  if (total !== 0) {
    alert("Tổng số tiền thắng thua phải bằng 0.");
    return;
  }

  scores.forEach(({ player, score }) => {
    if (!playerScores[player]) {
      playerScores[player] = 0;
    }
    playerScores[player] += score;
  });

  history.push(scores);
  saveToLocalStorage();
  displayHistory();
  updatePlayerScores();

  document.getElementById("score-popup").style.display = "none";
}

function displayHistory() {
  const historyList = document.getElementById("game-history");
  historyList.innerHTML = "";

  history.forEach((game, index) => {
    const div = document.createElement("div");
    const li = document.createElement("li");
    li.textContent = `${game
      .map((p) => `${p.player}: ${p.score}`)
      .join(" | ")}`;
    li.style.padding = "20px";
    li.style.background = "#bbdefb";
    div.innerHTML = `Ván ${index + 1}: `;
    div.appendChild(li);
    historyList.appendChild(div);
  });
}

function closePopup() {
  document.getElementById("score-popup").style.display = "none";
}
function saveToLocalStorage() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("playerScores", JSON.stringify(playerScores));
}
function loadFromLocalStorage() {
  const storedPlayers = localStorage.getItem("players");
  const storedHistory = localStorage.getItem("history");
  const storedPlayerScores = localStorage.getItem("playerScores");

  if (storedPlayers) {
    players = JSON.parse(storedPlayers);
    displayPlayers();
  }

  if (storedHistory) {
    history = JSON.parse(storedHistory);
    displayHistory();
  }

  if (storedPlayerScores) {
    playerScores = JSON.parse(storedPlayerScores);
    updatePlayerScores();
  }
}

window.onload = loadFromLocalStorage;
