# Supported via standard GitHub programming aids
# filepath: c:\Users\alese\Desktop\lavoro\frontend\app.py
# Frontend Streamlit per Sistema Ordini con Autenticazione Biforcata
# Supporta login con password personalizzata o VAT legacy

import streamlit as st
import requests
import pandas as pd
from typing import List, Dict, Any, Optional
import time

# URL del backend FastAPI
BACKEND_URL = "http://localhost:8001"

# ============================================================================
# FUNZIONI BACKEND INTEGRATION - Sistema di Autenticazione Potenziato
# ============================================================================

def check_user_has_password(ancodice: str) -> Optional[Dict[str, Any]]:
    """
    Verifica se un utente ha già una password personalizzata settata.
    
    Args:
        ancodice (str): Codice utente da verificare
        
    Returns:
        Dict con has_password (bool) e auth_method ("password"/"vat") 
        None se errore di comunicazione
    """
    # Supported via standard GitHub programming aids
    try:
        response = requests.get(f"{BACKEND_URL}/users/{ancodice}/has-password")
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            st.error("❌ Utente non trovato nel sistema")
            return None
        else:
            st.error(f"❌ Errore nel controllo password: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        st.error(f"🔌 Errore di connessione al backend: {e}")
        return None

def enhanced_login_backend(ancodice: str, second_var: str) -> Optional[Dict[str, Any]]:
    """
    Autenticazione biforcata: password personalizzata o VAT legacy.
    
    Args:
        ancodice (str): Codice utente
        second_var (str): Password personalizzata o Partita IVA
        
    Returns:
        Dict con success, action_needed, error_type, message
        None se errore di comunicazione
    """
    # Supported via standard GitHub programming aids
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/enhanced-login", 
            json={"ancodice": ancodice, "second_var": second_var}
        )
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"❌ Errore di autenticazione: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        st.error(f"🔌 Errore di connessione al backend: {e}")
        return None

def create_password_backend(ancodice: str, new_password: str) -> Optional[Dict[str, Any]]:
    """
    Crea una nuova password personalizzata per un utente.
    
    Args:
        ancodice (str): Codice utente
        new_password (str): Nuova password da creare
        
    Returns:
        Dict con success, message, password_strength
        None se errore di comunicazione
    """
    # Supported via standard GitHub programming aids
    try:
        response = requests.post(
            f"{BACKEND_URL}/users/{ancodice}/create-password",
            json={"ancodice": ancodice, "new_password": new_password}
        )
        if response.status_code == 200:
            return response.json()
        else:
            error_detail = response.json().get("detail", "Errore sconosciuto")
            st.error(f"❌ Errore nella creazione password: {error_detail}")
            return None
    except requests.exceptions.RequestException as e:
        st.error(f"🔌 Errore di connessione al backend: {e}")
        return None

def validate_password_backend(password: str) -> Optional[Dict[str, Any]]:
    """
    Valida una password in tempo reale tramite backend.
    CORRETTO: Usa SOLO il backend, no fallback locale per evitare inconsistenze.
    
    Args:
        password (str): Password da validare
        
    Returns:
        Dict con valid, strength, score, requirements, missing (formato backend)
        None se errore di comunicazione
    """
    # Supported via standard GitHub programming aids
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/validate-password",
            json={"password": password},
            timeout=5
        )
        if response.status_code == 200:
            return response.json()
        else:
            st.warning("🔌 Servizio validazione temporaneamente non disponibile")
            return None
    except requests.exceptions.RequestException:
        st.warning("🔌 Errore connessione validazione password")
        return None

# ============================================================================
# FUNZIONI BACKEND INTEGRATION - Ordini (Invariate)
# ============================================================================

# Supported via standard GitHub programming aids
def get_ordini(ancodice: str) -> List[Dict[str, Any]]:
    """Funzione per ottenere la lista degli ordini con date"""
    try:
        response = requests.get(f"{BACKEND_URL}/ordini/{ancodice}")
        if response.status_code == 200:
            return response.json().get("ordini", [])
        return []
    except requests.exceptions.RequestException:
        st.error("🔌 Errore nel recuperare gli ordini dal backend")
        return []

# Supported via standard GitHub programming aids
def get_info_ordine(mvserial: str) -> Dict[str, Any]:
    """Funzione per ottenere le informazioni di un ordine specifico"""
    try:
        response = requests.get(f"{BACKEND_URL}/ordini/info/{mvserial}")
        if response.status_code == 200:
            return response.json().get("info", {})
        return {}
    except requests.exceptions.RequestException:
        st.error("🔌 Errore nel recuperare le informazioni dell'ordine")
        return {}

# Supported via standard GitHub programming aids
def get_dettagli_ordine(mvserial: str) -> List[Dict[str, Any]]:
    """Funzione per ottenere i dettagli di un ordine"""
    try:
        response = requests.get(f"{BACKEND_URL}/ordini/dettagli/{mvserial}")
        if response.status_code == 200:
            return response.json().get("dettagli", [])
        return []
    except requests.exceptions.RequestException:
        st.error("🔌 Errore nel recuperare i dettagli dell'ordine")
        return []

# ============================================================================
# FUNZIONI UTILITY - Gestione Stati e Validazioni (CORRETTE)
# ============================================================================

def init_session_states() -> None:
    """Inizializza tutti gli stati di sessione necessari per il nuovo flusso."""
    # Supported via standard GitHub programming aids
    states: Dict[str, Any] = {
        "pagina": 1,
        "logged_in": False,
        "ancodice": None,
        "ordine_corrente": None,
        "password_creation_needed": False,
        "password_created": False,
        "error_type": None,
        "error_message": None,
        "auth_method": None
    }
    
    for key, default in states.items():
        if key not in st.session_state:
            st.session_state[key] = default

def clear_auth_states() -> None:
    """Pulisce gli stati di autenticazione per un nuovo login."""
    # Supported via standard GitHub programming aids
    clear_keys = [
        "logged_in", "ancodice", "password_creation_needed", 
        "password_created", "error_type", "error_message", "auth_method"
    ]
    for key in clear_keys:
        if key in st.session_state:
            st.session_state[key] = False if key == "logged_in" else None

def show_password_requirements(validation: Dict[str, Any]) -> None:
    """
    Mostra i requisiti password con stato di validazione in tempo reale.
    CORRETTO: Usa il formato esatto del backend API.
    
    Args:
        validation: Dict dal backend con 'valid', 'missing', 'requirements', etc.
    """
    # Supported via standard GitHub programming aids
    if not validation:
        st.info("🔌 Validazione non disponibile - inserisci password e clicca 'Crea Password'")
        return
    
    st.subheader("📋 Controllo Requisiti:")
    
    # Lista di tutti i requisiti dal backend
    all_requirements = validation.get('requirements', [])
    missing_requirements = validation.get('missing', [])
    
    # Mostra ogni requisito con stato
    for requirement in all_requirements:
        if requirement in missing_requirements:
            st.error(f"❌ {requirement}")
        else:
            st.success(f"✅ {requirement}")
    
    # Mostra stato generale e forza
    col1, col2 = st.columns(2)
    
    with col1:
        if validation.get('valid', False):
            st.success("🎉 **Password valida!**")
        else:
            st.error("❌ **Password non valida**")
    
    with col2:
        strength = validation.get('strength', 'sconosciuta')
        score = validation.get('score', 0)
        
        strength_colors = {
            "debole": "🔴",
            "media": "🟡", 
            "forte": "🟢"
        }
        color = strength_colors.get(strength.lower(), "⚪")
        
        st.info(f"{color} Forza: **{strength.title()}**")
        st.info(f"📊 Punteggio: **{score}/100**")

# ============================================================================
# PAGINE INTERFACCIA UTENTE - Sistema Autenticazione Potenziato
# ============================================================================

def pagina_login() -> None:
    """
    Pagina 1: Login potenziato con sistema biforcato.
    Gestisce sia autenticazione con password che con VAT legacy.
    """
    # Supported via standard GitHub programming aids
    st.title("🔐 Accesso Sistema Ordini")
    st.subheader("Inserisci le tue credenziali")
    
    # Mostra messaggio di conferma se password appena creata
    if st.session_state.get("password_created", False):
        st.success("🎉 Password creata con successo! Ora puoi usarla per accedere.")
        st.session_state["password_created"] = False
    
    # Form di login
    ancodice = st.text_input(
        "👤 Codice Utente", 
        placeholder="es: 0000001",
        help="Il tuo codice utente univoco nel sistema"
    )
    
    second_var = st.text_input(
        "🔑 Password o Partita IVA", 
        type="password",
        placeholder="Inserisci la tua password personalizzata o P.IVA",
        help="Se hai già creato una password personalizzata, inseriscila. Altrimenti usa la Partita IVA."
    )
    
    # Colonne per bottoni
    col1, col2 = st.columns([3, 1])
    
    with col1:
        login_button = st.button("🚀 Accedi", type="primary", use_container_width=True)
    
    with col2:
        if st.button("ℹ️ Info", use_container_width=True):
            st.info("""
            **Come funziona l'accesso:**
            
            🔐 **Se hai una password personalizzata:**
            Inserisci il tuo codice utente e la password che hai creato.
            
            🏢 **Se è il tuo primo accesso:**
            Inserisci il tuo codice utente e la Partita IVA. Ti verrà chiesto di creare una password personalizzata.
            
            💡 **Hai dimenticato la password?**
            Contatta l'amministratore del sistema.
            """)
    
    # Gestione login
    if login_button:
        if not ancodice or not second_var:
            st.warning("⚠️ Inserisci sia il codice utente che la password/P.IVA")
            return
        
        # Mostra spinner durante autenticazione
        with st.spinner("🔍 Verifica credenziali..."):
            # Effettua l'autenticazione biforcata
            auth_result = enhanced_login_backend(ancodice, second_var)
        
        if auth_result is None:
            # Errore di comunicazione già gestito in enhanced_login_backend
            return
        
        # Gestisce il risultato dell'autenticazione
        handle_auth_result(auth_result, ancodice)

def handle_auth_result(auth_result: Dict[str, Any], ancodice: str) -> None:
    """
    Gestisce il risultato dell'autenticazione e naviga alla pagina appropriata.
    
    Args:
        auth_result: Risultato dal backend con success, action_needed, etc.
        ancodice: Codice utente per memorizzazione in sessione
    """
    # Supported via standard GitHub programming aids
    if auth_result['success']:
        action = auth_result['action_needed']
        
        if action == "login_success":
            # Login riuscito - vai agli ordini
            st.session_state["logged_in"] = True
            st.session_state["ancodice"] = ancodice
            st.success("✅ Login riuscito! Benvenuto nel sistema ordini.")
            st.session_state["pagina"] = 2
            st.rerun()
            
        elif action == "create_password":
            # VAT corretta ma serve creare password
            st.session_state["ancodice"] = ancodice
            st.session_state["password_creation_needed"] = True
            st.info("🔑 Partita IVA corretta! Ora crea la tua password personalizzata.")
            st.session_state["pagina"] = 4  # Pagina creazione password
            st.rerun()
            
    else:
        # Autenticazione fallita
        error_type = auth_result.get('error_type', 'generic')
        error_message = auth_result.get('message', 'Credenziali non valide')
        
        st.session_state["error_type"] = error_type
        st.session_state["error_message"] = error_message
        st.session_state["pagina"] = 5  # Pagina errore
        st.rerun()

def pagina_creazione_password() -> None:
    """
    Pagina 4: Creazione password personalizzata.
    CORRETTA: Usa formato backend e gestione stati consistente.
    """
    # Supported via standard GitHub programming aids
    st.title("🔑 Creazione Password Personalizzata")
    
    # Controllo sessione CORRETTO
    if 'ancodice' not in st.session_state or not st.session_state.get("password_creation_needed", False):
        st.error("❌ Errore: Sessione scaduta o accesso non autorizzato.")
        if st.button("🔙 Torna al Login"):
            clear_auth_states()
            st.session_state["pagina"] = 1  # CORRETTO: usa "pagina", non "current_page"
            st.rerun()
        return
    
    ancodice = st.session_state["ancodice"]
    st.subheader(f"👤 Utente: {ancodice}")
    
    # Informazioni di conferma VAT
    st.success("🎉 **Partita IVA verificata con successo!**")
    st.info("""
    Ora crea la tua password personalizzata per accessi futuri più sicuri e veloci.
    La password sostituirà l'uso della Partita IVA per i prossimi login.
    """)
    
    # Form creazione password
    new_password = st.text_input(
        "🔒 Nuova Password", 
        type="password",
        placeholder="Inserisci la tua nuova password",
        help="La password deve rispettare tutti i requisiti di sicurezza"
    )
    
    confirm_password = st.text_input(
        "🔒 Conferma Password", 
        type="password",
        placeholder="Conferma la password inserita sopra"
    )
    
    # Validazione in tempo reale se c'è una password
    validation_result = None
    if new_password:
        validation_result = validate_password_backend(new_password)
        if validation_result:
            show_password_requirements(validation_result)
        
        # Controlla corrispondenza password
        if confirm_password:
            if new_password == confirm_password:
                st.success("✅ Le password corrispondono")
            else:
                st.error("❌ Le password non corrispondono")
    
    # Bottoni azione
    col1, col2 = st.columns(2)
    
    with col1:
        create_button = st.button("💾 Crea Password", type="primary", use_container_width=True)
    
    with col2:
        cancel_button = st.button("❌ Annulla", use_container_width=True)
    
    # Gestione creazione password
    if create_button:
        if not new_password or not confirm_password:
            st.warning("⚠️ Inserisci e conferma la password")
            return
        
        if new_password != confirm_password:
            st.error("❌ Le password non corrispondono")
            return
        
        # Validazione finale
        if not validation_result:
            validation_result = validate_password_backend(new_password)
        
        if not validation_result:
            st.error("❌ Impossibile validare la password - servizio non disponibile")
            return
        
        if not validation_result.get('valid', False):
            st.error("❌ La password non rispetta tutti i requisiti di sicurezza")
            missing_reqs = validation_result.get('missing', [])
            if missing_reqs:
                st.error(f"Requisiti mancanti: {', '.join(missing_reqs)}")
            return
        
        # Crea password nel backend
        with st.spinner("💾 Creazione password in corso..."):
            result = create_password_backend(ancodice, new_password)
        
        if result and result.get('success'):
            st.success("🎉 Password creata con successo!")
            st.info("🔐 Dal prossimo accesso potrai usare la tua password personalizzata invece della Partita IVA.")
            
            # Aggiorna stati e torna al login
            st.session_state["password_created"] = True
            clear_auth_states()
            st.session_state["pagina"] = 1
            
            # Piccola pausa per mostrare il messaggio
            time.sleep(1)
            st.rerun()
    
    # Gestione annullamento
    if cancel_button:
        clear_auth_states()
        st.session_state["pagina"] = 1
        st.rerun()

def pagina_errore() -> None:
    """
    Pagina 5: Gestione errori di autenticazione.
    Mostra messaggi specifici in base al tipo di errore.
    """
    # Supported via standard GitHub programming aids
    st.title("⚠️ Errore di Autenticazione")
    
    error_type = st.session_state.get("error_type", "generic")
    error_message = st.session_state.get("error_message", "Errore sconosciuto")
    
    # Mostra errore specifico in base al tipo
    if error_type == "wrong_password":
        st.error("🔐 **Password non corretta!**")
        st.info("""
        💡 **Cosa puoi fare:**
        - Verifica di aver inserito correttamente la password
        - Controlla che il Caps Lock non sia attivo
        - Se hai dimenticato la password, contatta l'amministratore
        """)
        
    elif error_type == "wrong_vat":
        st.error("🏢 **Partita IVA non corretta!**")
        st.info("""
        💡 **Cosa puoi fare:**
        - Verifica di aver inserito la P.IVA corretta
        - Assicurati che sia associata al tuo codice utente
        - Controlla di non aver inserito spazi o caratteri extra
        """)
        
    elif error_type == "user_not_found":
        st.error("👤 **Codice utente non trovato!**")
        st.info("""
        💡 **Cosa puoi fare:**
        - Verifica di aver inserito il codice utente corretto
        - Contatta l'amministratore se sei sicuro dei dati
        """)
        
    elif error_type == "system_error":
        st.error("🛠️ **Errore di sistema!**")
        st.error(f"Dettagli: {error_message}")
        st.info("""
        💡 **Cosa puoi fare:**
        - Riprova tra qualche minuto
        - Se il problema persiste, contatta l'assistenza tecnica
        """)
        
    else:
        st.error("❌ **Credenziali non valide!**")
        st.warning(f"Dettagli: {error_message}")
        st.info("""
        💡 **Cosa puoi fare:**
        - Verifica di aver inserito correttamente tutti i dati
        - Se hai una password personalizzata, usala invece della P.IVA
        - Contatta l'amministratore se i problemi persistono
        """)
    
    # Bottone per tornare al login
    if st.button("🔄 Torna al Login", type="primary", use_container_width=True):
        clear_auth_states()
        st.session_state["pagina"] = 1
        st.rerun()

# Supported via standard GitHub programming aids
def pagina_elenco_ordini() -> None:
    """Pagina 2: Elenco ordini (invariata dal sistema precedente)"""
    st.title("📋 Storico Ordini")
    
    ancodice = st.session_state.get("ancodice", "")
    st.subheader(f"👤 Utente: {ancodice}")
    
    ordini = get_ordini(ancodice)
    
    if not ordini:
        st.info("📭 Nessun ordine trovato per questo utente.")
        return
    
    # Crea una lista di opzioni per il selectbox con ordine e data
    opzioni_ordini: List[str] = []
    for ordine in ordini:
        # Formatta la data per la visualizzazione
        data_str = ordine['mvdatreg'][:10]  # Prende solo la parte della data (YYYY-MM-DD)
        opzione = f"{ordine['mvserial']} - {data_str}"
        opzioni_ordini.append(opzione)
    
    # Selectbox con ordini e date
    ordine_scelto_display = st.selectbox("📝 Seleziona un ordine", opzioni_ordini)
    
    if ordine_scelto_display and st.button("👁️ Vedi dettagli ordine", type="primary"):
        # Estrae solo il codice ordine dalla selezione
        ordine_scelto = ordine_scelto_display.split(" - ")[0]
        st.session_state["ordine_corrente"] = ordine_scelto
        st.session_state["pagina"] = 3
        st.rerun()
    
    # Logout button
    if st.button("🚪 Logout"):
        clear_auth_states()
        st.session_state["pagina"] = 1
        st.success("👋 Logout effettuato con successo!")
        st.rerun()

# Supported via standard GitHub programming aids
def pagina_dettaglio_ordine() -> None:
    """Pagina 3: Dettaglio ordine (invariata dal sistema precedente)"""
    ordine_corrente = st.session_state.get("ordine_corrente", "")
    
    # Ottieni le informazioni dell'ordine inclusa la data
    info_ordine = get_info_ordine(ordine_corrente)
    
    # Mostra il titolo con il numero ordine
    st.title(f"📄 Dettaglio Ordine {ordine_corrente}")
    
    # Mostra la data come sottotitolo se disponibile
    if info_ordine and 'mvdatreg' in info_ordine:
        data_formattata = info_ordine['mvdatreg'][:10]  # Formato YYYY-MM-DD
        st.subheader(f"📅 Data ordine: {data_formattata}")
    
    # Ottieni e mostra i dettagli dell'ordine
    dettagli = get_dettagli_ordine(ordine_corrente)
    if not dettagli:
        st.info("📭 Nessun prodotto trovato per questo ordine.")
        return
    
    # Supported via standard GitHub programming aids
    # Convert list of dictionaries to DataFrame for better table display
    try:
        df_dettagli: pd.DataFrame = pd.DataFrame(dettagli)
        
        # Display dataframe with explicit type handling to avoid overload resolution issues
        # Supported via standard GitHub programming aids
        st.dataframe(
            df_dettagli, 
            use_container_width=True,
            hide_index=True
        )
    except Exception as e:
        st.error(f"❌ Errore nella visualizzazione dei dettagli ordine: {e}")
        # Fallback: mostra i dati in formato più semplice
        for dettaglio in dettagli:
            st.write(dettaglio)
    
    # Pulsante per tornare all'elenco
    # Supported via standard GitHub programming aids
    _, col2, _ = st.columns([1, 2, 1])
    with col2:
     if st.button("⬅️ Torna all'elenco ordini"):
         st.session_state["pagina"] = 2
         st.rerun()

# ============================================================================
# LOGICA PRINCIPALE APPLICAZIONE
# ============================================================================

# Supported via standard GitHub programming aids
def main() -> None:
    """
    Funzione principale per gestire la navigazione tra le pagine.
    Implementa il flusso completo di autenticazione biforcata e gestione ordini.
    """
    # Configurazione pagina Streamlit
    st.set_page_config(
        page_title="Sistema Gestione Ordini",
        page_icon="📦",
        layout="centered",
        initial_sidebar_state="collapsed"
    )
    
    # Inizializzazione stati di sessione
    init_session_states()
    
    # Sidebar con informazioni di debug (solo in sviluppo)
    if st.sidebar.checkbox("🔧 Debug Info", value=False):
        st.sidebar.json(dict(st.session_state))
    
    # Navigazione principale basata su pagina corrente
    pagina_corrente = st.session_state.get("pagina", 1)
    
    if pagina_corrente == 1:
        # Pagina 1: Login con sistema biforcato
        pagina_login()
        
    elif pagina_corrente == 2:
        # Pagina 2: Elenco ordini (accessibile solo se loggati)
        if st.session_state.get("logged_in", False):
            pagina_elenco_ordini()
        else:
            st.error("⚠️ Accesso non autorizzato")
            st.session_state["pagina"] = 1
            st.rerun()
            
    elif pagina_corrente == 3:
        # Pagina 3: Dettaglio ordine (accessibile solo se loggati)
        if st.session_state.get("logged_in", False):
            pagina_dettaglio_ordine()
        else:
            st.error("⚠️ Accesso non autorizzato")
            st.session_state["pagina"] = 1
            st.rerun()
            
    elif pagina_corrente == 4:
        # Pagina 4: Creazione password personalizzata
        pagina_creazione_password()
            
    elif pagina_corrente == 5:
        # Pagina 5: Gestione errori di autenticazione
        pagina_errore()
        
    else:
        # Fallback: torna al login
        st.error("⚠️ Pagina non riconosciuta")
        st.session_state["pagina"] = 1
        st.rerun()

if __name__ == "__main__":
    main()