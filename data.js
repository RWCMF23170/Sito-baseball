/* ============================================================
   FIRESTORE DATA HANDLER
   ============================================================ */

// =========================
// PLAYERS
// =========================

async function getPlayers() {
  const snap = await db.collection("players").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function addPlayerToDB(player) {
  await db.collection("players").doc(String(player.id)).set(player);
}

// =========================
// STATS
// =========================

async function getStats(id) {
  const doc = await db.collection("stats").doc(String(id)).get();
  if (!doc.exists) return defaultStats();
  return doc.data();
}

async function saveStats(id, stats) {
  await db.collection("stats").doc(String(id)).set(stats);
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
