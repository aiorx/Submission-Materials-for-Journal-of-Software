<!-- Form to redirect to various journals -->
<!-- Assisted with basic coding tools -->

<form>
  <label for="journalSelector">Select a journal:</label>
  <select id="journalSelector" onchange="redirectToJournal()">
    <option value="none">--Select a journal--</option>
    <option value="https://www.aeaweb.org/journals/aer/">American Economic Review</option>
    <option value="https://www.jstor.org/journal/econometrica">Econometrica</option>
    <option value="https://www.journals.elsevier.com/journal-of-political-economy">Journal of Political Economy</option>
    <option value="https://www.mitpressjournals.org/loi/qje">Quarterly Journal of Economics</option>
    <option value="https://www.journals.uchicago.edu/journals/jpe">Journal of Political Economy</option>
  </select>
</form>

<script>
  function redirectToJournal() {
    var journal = document.getElementById("journalSelector").value;
    if (journal !== "none") {
      window.location = journal;
    }
  }
</script>
