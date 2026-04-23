/* ============================================================
   FIRESTORE DATA HANDLER
   ============================================================ */

// =========================
// PLAYERS (localStorage)
// =========================

// Inizializza lista giocatori se non esiste
if (!localStorage.getItem("players")) {
  localStorage.setItem("players", JSON.stringify([]));
}

function getPlayers() {
  try {
    return JSON.parse(localStorage.getItem("players")) || [];
  } catch (e) {
    console.error("Errore nel caricamento giocatori:", e);
    return [];
  }
}

function addPlayerToDB(player) {
  const players = getPlayers();
  const index = players.findIndex(p => p.id == player.id);
  
  if (index >= 0) {
    players[index] = player;
  } else {
    players.push(player);
  }
  
  localStorage.setItem("players", JSON.stringify(players));
}

// =========================
// STATS (localStorage)
// =========================

function getStats(id) {
  try {
    const statsKey = "stats_" + String(id);
    const saved = localStorage.getItem(statsKey);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultStats();
  } catch (e) {
    console.error("Errore nel caricamento statistiche:", e);
    return defaultStats();
  }
}

function saveStats(id, stats) {
  const statsKey = "stats_" + String(id);
  localStorage.setItem(statsKey, JSON.stringify(stats));
}

// =========================
// DEFAULT STATS
// =========================

function defaultStats() {
  return {
    batting: {
      AB: 0, PA: 0, H: 0, "2B": 0, "3B": 0, HR: 0,
      RBI: 0, R: 0, BB: 0, HBP: 0, SF: 0, SH: 0,
      SO: 0, SB: 0, CS: 0,
      AVG: "0.000", OBP: "0.000", SLG: "0.000", OPS: "0.000"
    },
    pitching: {
      IP: 0, BF: 0, H: 0, R: 0, ER: 0, BB: 0, SO: 0,
      HR: 0, WP: 0, HB: 0, W: 0, L: 0, SV: 0, BS: 0,
      Strikes: 0, Balls: 0,
      ERA: "0.00", WHIP: "0.00", StrikePCT: "0.0", BallPCT: "0.0"
    },
    fielding: {
      TC: 0, PO: 0, A: 0, E: 0, DP: 0, TP: 0,
      PB: 0, SBA: 0, CS: 0,
      FPCT: "0.000"
    }
  };
}

// =========================
// CALCOLI STATISTICHE
// =========================

// Batting
function calcAVG(b) {
  return b.AB > 0 ? (b.H / b.AB).toFixed(3) : "0.000";
}

function calcOBP(b) {
  const num = b.H + b.BB + b.HBP;
  const den = b.AB + b.BB + b.HBP + b.SF;
  return den > 0 ? (num / den).toFixed(3) : "0.000";
}

function calcSLG(b) {
  const TB = b.H + b["2B"] + (b["3B"] * 2) + (b.HR * 3);
  return b.AB > 0 ? (TB / b.AB).toFixed(3) : "0.000";
}

function calcOPS(b) {
  return (parseFloat(calcOBP(b)) + parseFloat(calcSLG(b))).toFixed(3);
}

// Pitching
function calcERA(p) {
  return p.IP > 0 ? ((p.ER * 7) / p.IP).toFixed(2) : "0.00"; // 7 inning per FIBS
}

function calcWHIP(p) {
  return p.IP > 0 ? ((p.BB + p.H) / p.IP).toFixed(2) : "0.00";
}

function calcStrikePCT(p) {
  const totalPitches = p.Strikes + p.Balls;
  return totalPitches > 0 ? (p.Strikes / totalPitches * 100).toFixed(1) : "0.0";
}

function calcBallPCT(p) {
  const totalPitches = p.Strikes + p.Balls;
  return totalPitches > 0 ? (p.Balls / totalPitches * 100).toFixed(1) : "0.0";
}

// Fielding
function calcFPCT(f) {
  const den = f.TC;
  const num = f.PO + f.A;
  return den > 0 ? (num / den).toFixed(3) : "0.000";
}

function updateComputedStats(stats) {
  stats.batting.AVG = calcAVG(stats.batting);
  stats.batting.OBP = calcOBP(stats.batting);
  stats.batting.SLG = calcSLG(stats.batting);
  stats.batting.OPS = calcOPS(stats.batting);

  stats.pitching.ERA = calcERA(stats.pitching);
  stats.pitching.WHIP = calcWHIP(stats.pitching);
  stats.pitching.StrikePCT = calcStrikePCT(stats.pitching);
  stats.pitching.BallPCT = calcBallPCT(stats.pitching);

  stats.fielding.FPCT = calcFPCT(stats.fielding);

  return stats;
}

// =========================
// MATCHES
// =========================

// Inizializza lista partite
if (!localStorage.getItem("matches")) {
  localStorage.setItem("matches", JSON.stringify([]));
}

function getMatches() {
  return JSON.parse(localStorage.getItem("matches"));
}

function saveMatches(matches) {
  localStorage.setItem("matches", JSON.stringify(matches));
}

// Aggiunge una partita
function addMatch(home, away, hs, as) {
  const matches = getMatches();

  matches.push({
    id: Date.now(),
    home,
    away,
    homeScore: hs,
    awayScore: as,
    date: new Date().toISOString()
  });

  saveMatches(matches);
}

// Elimina una partita
function removeMatch(id) {
  let matches = getMatches();
  matches = matches.filter(m => m.id != id);
  saveMatches(matches);
}

// Modifica una partita
function updateMatch(id, updatedData) {
  let matches = getMatches();
  const index = matches.findIndex(m => m.id == id);
  if (index >= 0) {
    matches[index] = { ...matches[index], ...updatedData };
    saveMatches(matches);
  }
}

// Alias per compatibilità con admin.html
function getGames() {
  return getMatches();
}

// =========================
// PLAYER HISTORY (localStorage)
// =========================

function getPlayerHistory(playerId) {
  try {
    const historyKey = "history_" + String(playerId);
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  } catch (e) {
    console.error("Errore nel caricamento cronologia:", e);
    return [];
  }
}

// Calcolo classifica W-L
function standings() {
  const table = {};

  getMatches().forEach(m => {
    if (!table[m.home]) table[m.home] = { W: 0, L: 0 };
    if (!table[m.away]) table[m.away] = { W: 0, L: 0 };

    if (m.homeScore > m.awayScore) {
      table[m.home].W++;
      table[m.away].L++;
    } else {
      table[m.away].W++;
      table[m.home].L++;
    }
  });

  return table;
}
