const MAX_GAMES = 3;
let games = JSON.parse(localStorage.getItem("games")) || [];
let currentGame = null;
let keyBuffer = "";

function saveGames() {
  localStorage.setItem("games", JSON.stringify(games));
}

function newGame() {
  if (games.length >= MAX_GAMES) {
    alert("Maximum of 3 games stored.");
    return;
  }

  currentGame = {
    id: Date.now(),
    roster: [],
    teamFouls: 0
  };

  games.push(currentGame);
  saveGames();
  refreshGameList();
  render();
}

function loadGame(id) {
  currentGame = games.find(g => g.id == id);
  render();
}

function refreshGameList() {
  const list = document.getElementById("gameList");
  list.innerHTML = "";
  games.forEach(g => {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = `Game ${g.id}`;
    list.appendChild(option);
  });
}

function addPlayer() {
  if (!currentGame) return;

  const number = document.getElementById("playerNumber").value;
  const name = document.getElementById("playerName").value;

  currentGame.roster.push({
    number,
    name,
    points: 0,
    fouls: 0
  });

  saveGames();
  render();
}

function render() {
  if (!currentGame) return;

  document.getElementById("teamFouls").textContent = currentGame.teamFouls;
  const table = document.getElementById("statTable");
  table.innerHTML = "";

  currentGame.roster.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.number}</td>
      <td>${p.name || ""}</td>
      <td>${p.points}</td>
      <td>${p.fouls}</td>
    `;
    table.appendChild(row);
  });

  const rosterList = document.getElementById("rosterList");
  rosterList.innerHTML = "";
  currentGame.roster.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.number} ${p.name || ""}`;
    rosterList.appendChild(li);
  });
}

document.addEventListener("keydown", e => {
  if (!currentGame) return;

  if (e.key === "t") {
    currentGame.teamFouls = 0;
    saveGames();
    render();
    return;
  }

  if (/[pf0-9]/i.test(e.key)) {
    keyBuffer += e.key.toLowerCase();
  }

  if (keyBuffer.length >= 2) {
    const action = keyBuffer[0];
    const number = keyBuffer.slice(1);

    const player = currentGame.roster.find(p => p.number === number);
    if (player) {
      if (action === "p") player.points += 1;
      if (action === "f") {
        player.fouls += 1;
        currentGame.teamFouls += 1;
      }
      saveGames();
      render();
    }
    keyBuffer = "";
  }
});

refreshGameList();
