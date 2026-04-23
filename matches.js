/* ============================================================
   MATCHES HANDLER
   ============================================================ */

// Gestione partite
function initMatches() {
  if (!localStorage.getItem("matches")) {
    localStorage.setItem("matches", JSON.stringify([]));
  }
}

initMatches();
