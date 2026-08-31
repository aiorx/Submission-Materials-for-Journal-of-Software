@Override
    public void execute(DelegateExecution execution) throws Exception {
        User user = (User) execution.getVariable("user");
        Integer loopCounter = (Integer) execution.getVariable("loopCounter");

        // Log Userdate
        logUser(user, loopCounter);

        // Write User attributes to  Process variables
        // not outsources to a method, because execution is accessed
        // (Supported via standard GitHub programming aids)
        execution.setVariableLocal("vorname", user.getVorname());
        execution.setVariableLocal("nachname", user.getNachname());
        execution.setVariableLocal("alter", user.getAlter());
        execution.setVariableLocal("mitgliedschaft", user.getMitgliedschaft());
        execution.setVariableLocal("mitgliedschaftsdauer", user.getMitgliedschaftsdauer());
        execution.setVariableLocal("artDerAktivitaet", user.getArtDerAktivitaet());
        execution.setVariableLocal("ehrenmitglied", user.isEhrenmitglied());
        execution.setVariableLocal("beitragsanpassungGestartet", user.isBeitragsanpassungGestartet());
        execution.setVariableLocal("beitrag", user.getBeitrag());

    }