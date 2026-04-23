/* ============================================================
   DESCRIZIONI STATISTICHE
   ============================================================ */

// Descrizioni delle statistiche Baseball - Terminologia FIBS
const STAT_DESCRIPTIONS = {
  // BATTUTA
  AVG: "Media battuta - Valide divise per battute",
  OBP: "Percentuale di arrivo in base - Misura la capacità di arrivare in base",
  SLG: "Percentuale di slugging - Misura la potenza offensiva",
  OPS: "OBP + SLG - Combinazione di arrivo in base e potenza",
  AB: "Battute - Numero di volte che il giocatore batte",
  PA: "Apparizioni - Ogni volta che il giocatore si presenta al piatto",
  H: "Valide - Colpi ben piazzati che permettono di raggiungere una base",
  "2B": "Doppi - Valida che permette di raggiungere la seconda base",
  "3B": "Tripli - Valida che permette di raggiungere la terza base",
  HR: "Fuoricampo - Valida che consente di percorrere tutte le basi",
  RBI: "Punti battuti - Corse segnate grazie a una battuta",
  R: "Corse - Volte che il giocatore completa il giro delle basi",
  BB: "Basi per palle - Quando il lanciatore fa 4 lanci fuori dalla zona di strike",
  HBP: "Colpito da lancio - Quando il giocatore viene colpito dal lancio",
  SF: "Volo sacrificio - Colpo che fa segnare una corsa con eliminazione",
  SH: "Battuta sacrificio - Battuta intenzionale per avanzare un corridore",
  SO: "Strikeout - Quando il battitore non riesce a contrastare 3 strike",
  SB: "Furti di base - Quando il corridore avanza senza una battuta",
  CS: "Colti in furto - Quando il corridore tenta di rubare ma viene eliminato",
  
  // LANCIO
  ERA: "Media punti consentiti - Punti meritati consentiti per 7 inning",
  WHIP: "Indice di efficienza - Basi per palle e valide consentite per inning",
  IP: "Inning lanciati - Unità di misura del lavoro di lancio",
  BF: "Battitori affrontati - Numero di battitori che il lanciatore ha affrontato",
  ER: "Punti meritati - Corse segnate direttamente per colpa del lanciatore",
  WP: "Lancio selvaggio - Lancio impossibile da bloccare per il ricevitore",
  HB: "Battitore colpito - Quando il lanciatore colpisce il giocatore",
  W: "Vittorie - Gare vinte da questo lanciatore",
  L: "Sconfitte - Gare perse da questo lanciatore",
  SV: "Salvataggi - Quando il lanciatore termina una gara in situazione critica",
  BS: "Salvataggi falliti - Quando il lanciatore non conserva il vantaggio",
  Strikes: "Numero di strike lanciati - Conteggio totale degli strike",
  Balls: "Numero di ball lanciati - Conteggio totale dei ball",
  StrikePCT: "Percentuale strike - Percentuale di strike sul totale dei lanci",
  BallPCT: "Percentuale ball - Percentuale di ball sul totale dei lanci",
  
  // DIFESA
  FPCT: "Percentuale di difesa - Misura la capacità difensiva del giocatore",
  TC: "Azioni difensive - Tutte le giocate difensive effettuate",
  PO: "Eliminazioni dirette - Quando il giocatore estingue un corridore",
  A: "Assistenze - Quando il giocatore aiuta a estinguere un corridore",
  E: "Errori - Sbagli difensivi che permettono ai corridori di avanzare",
  DP: "Doppi giochi - Due eliminazioni nello stesso gioco",
  TP: "Tripli giochi - Tre eliminazioni nello stesso gioco",
  PB: "Palline perse - Palloni non fermati dal ricevitore",
  SBA: "Tentativi di furto di base - Quante volte cercano di rubare una base"
};

// Funzione per ottenere la descrizione
function getStatDescription(stat) {
  return STAT_DESCRIPTIONS[stat] || stat;
}
