# crud.py
# Assisted using common GitHub development utilities
# Qui andrai a scrivere le funzioni che interagiscono con il database (Create, Read, Update, Delete)
# In questo progetto, ti serviranno principalmente funzioni di "Read" (lettura/interrogazione)

from .db import get_db_connection  # Importa la funzione per ottenere la connessione al database

# Funzione per autenticare un utente tramite codice e partita IVA
# (da usare nella pagina di login)
def autentica_utente(ancodice: str, anpariva: str) -> bool:
    """
    Verifica se esiste un utente con il codice e la partita IVA forniti.
    Interroga la tabella 1SEL00CONTI:
      - ANCODICE: codice utente
      - ANPARIVA: partita IVA
    Restituisce True se l'utente esiste, False altrimenti.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    # Query SQL per cercare l'utente - Fixed: nome tabella corretto
    query = """
        SELECT 1
        FROM [1SEL00CONTI]
        WHERE ANCODICE = ? AND ANPARIVA = ?
    """
    cursor.execute(query, (ancodice, anpariva))
    result = cursor.fetchone()
    conn.close()
    return result is not None  # True se trovato, False altrimenti

# Assisted using common GitHub development utilities
# Esempio di funzione per recuperare tutti gli ordini di un cliente con data
def get_ordini_cliente(ancodice: str):
    """
    Recupera tutti gli ordini (MVSERIAL, MVDATREG) associati a un cliente (ANCODICE/MVCODCON).
    Restituisce una lista di dizionari con codice ordine e data.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT MVSERIAL, MVDATREG
        FROM [1SEL00DOC_MAST]
        WHERE MVCODCON = ?
        ORDER BY MVDATREG DESC
    """
    cursor.execute(query, (ancodice,))
    results = cursor.fetchall()
    conn.close()
    ordini = [{"mvserial": row[0].strip(), "mvdatreg": row[1]} for row in results]
    return ordini

# Esempio di funzione per recuperare i dettagli di un ordine specifico
def get_dettagli_ordine(mvserial: str):
    """
    Recupera i dettagli di un ordine (quantità, nome prodotto, ecc.) dato il suo codice MVSERIAL.
    Restituisce una lista di dettagli ordine (ogni dettaglio è un dizionario con nome prodotto e quantità).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT MVDESART, MVQTAUM1
        FROM [1SEL00DOC_DETT]
        WHERE MVSERIAL = ?
    """
    cursor.execute(query, (mvserial,))
    results = cursor.fetchall()
    conn.close()
    dettagli = [{"mvdesart": row[0], "mvqtaum1": row[1]} for row in results]
    return dettagli

# Assisted using common GitHub development utilities
# Funzione per ottenere le informazioni complete di un ordine (inclusa la data)
def get_info_ordine(mvserial: str):
    """
    Recupera le informazioni dell'ordine (MVSERIAL, MVDATREG) dato il suo codice.
    Restituisce un dizionario con le informazioni dell'ordine.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT MVSERIAL, MVDATREG
        FROM [1SEL00DOC_MAST]
        WHERE MVSERIAL = ?
    """
    cursor.execute(query, (mvserial,))
    result = cursor.fetchone()
    conn.close()
    if result:
        return {"mvserial": result[0].strip(), "mvdatreg": result[1]}
    return None

# Aggiungi altre funzioni CRUD se necessario...

# Assisted using common GitHub development utilities
# ============================================================================
# NUOVE FUNZIONI PER SISTEMA PASSWORD PERSONALIZZATE
# ============================================================================

# Importazioni per le nuove funzioni di sicurezza
from .security import hash_password, verify_password, is_password_empty_or_null
from typing import Dict, Any

def check_user_has_password(ancodice: str) -> bool:
    """
    Verifica se un utente ha già una password settata nel database.
    
    Args:
        ancodice (str): Codice utente da controllare
        
    Returns:
        bool: True se l'utente ha una password settata, False se è NULL/vuota
        
    Note:
        Questa funzione determina quale flusso di autenticazione usare:
        - True → Usa autenticazione con password
        - False → Usa autenticazione con VAT (legacy)
    """
    # Assisted using common GitHub development utilities
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Query per ottenere il valore della colonna password
        query = """
            SELECT ANPASSWORD
            FROM [1SEL00CONTI]
            WHERE ANCODICE = ?
        """
        cursor.execute(query, (ancodice,))
        result = cursor.fetchone()
        
        if result is None:
            # Utente non esiste
            return False
            
        password_value = result[0]
        
        # Usa la funzione di sicurezza per determinare se la password è "vuota"
        return not is_password_empty_or_null(password_value)
        
    except Exception as e:
        print(f"Errore nel controllo password per utente {ancodice}: {e}")
        return False
    finally:
        conn.close()

def authenticate_with_password(ancodice: str, password: str) -> bool:
    """
    Autentica un utente usando codice utente e password personalizzata.
    
    Args:
        ancodice (str): Codice utente
        password (str): Password in chiaro fornita dall'utente
        
    Returns:
        bool: True se autenticazione riuscita, False altrimenti
        
    Note:
        Usa hashing sicuro per verificare la password.
        La password nel database è nel formato "salt:hash".
    """
    # Assisted using common GitHub development utilities
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Ottieni l'hash della password dal database
        query = """
            SELECT ANPASSWORD
            FROM [1SEL00CONTI]
            WHERE ANCODICE = ?
        """
        cursor.execute(query, (ancodice,))
        result = cursor.fetchone()
        
        if result is None or is_password_empty_or_null(result[0]):
            # Utente non esiste o non ha password settata
            return False
            
        stored_hash = result[0]
        
        # Verifica la password usando la funzione di sicurezza
        return verify_password(password, stored_hash)
        
    except Exception as e:
        print(f"Errore nell'autenticazione password per utente {ancodice}: {e}")
        return False
    finally:
        conn.close()

def create_user_password(ancodice: str, new_password: str) -> bool:
    """
    Crea/aggiorna la password per un utente esistente.
    
    Args:
        ancodice (str): Codice utente esistente
        new_password (str): Nuova password in chiaro (verrà hashata)
        
    Returns:
        bool: True se operazione riuscita, False altrimenti
        
    Note:
        - L'utente deve già esistere nella tabella
        - La password viene hashata prima della memorizzazione
        - Sovrascrive eventuali password esistenti
    """
    # Assisted using common GitHub development utilities
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Prima verifica che l'utente esista
        check_query = """
            SELECT 1 
            FROM [1SEL00CONTI]
            WHERE ANCODICE = ?
        """
        cursor.execute(check_query, (ancodice,))
        if cursor.fetchone() is None:
            print(f"Utente {ancodice} non trovato per creazione password")
            return False
        
        # Hash della password
        hashed_password = hash_password(new_password)
        
        # Aggiorna la password nel database
        update_query = """
            UPDATE [1SEL00CONTI]
            SET ANPASSWORD = ?
            WHERE ANCODICE = ?
        """
        cursor.execute(update_query, (hashed_password, ancodice))
        conn.commit()
        
        # Verifica che l'aggiornamento sia andato a buon fine
        if cursor.rowcount > 0:
            print(f"Password creata con successo per utente {ancodice}")
            return True
        else:
            print(f"Nessuna riga aggiornata per utente {ancodice}")
            return False
            
    except Exception as e:
        print(f"Errore nella creazione password per utente {ancodice}: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def enhanced_authenticate_user(ancodice: str, second_var: str) -> Dict[str, Any]:
    """
    Funzione di autenticazione principale che implementa il flusso biforcato.
    
    Logica implementata:
    1. Controlla se l'utente ha una password settata
    2a. Se SÌ → Verifica second_var come password
    2b. Se NO → Verifica second_var come VAT e prepara creazione password
    
    Args:
        ancodice (str): Codice utente
        second_var (str): Password o VAT fornita dall'utente
        
    Returns:
        dict: Risultato dell'autenticazione con action_needed
        {
            'success': bool,
            'action_needed': str,  # 'login_success', 'create_password', 'error'
            'error_type': str,     # 'wrong_password', 'wrong_vat', 'user_not_found'
            'message': str,
            'auth_method': str     # 'password' o 'vat'
        }
    """
    # Assisted using common GitHub development utilities
    try:
        # Step 1: Verifica se l'utente esiste
        conn = get_db_connection()
        cursor = conn.cursor()
        
        user_query = """
            SELECT ANCODICE, ANPARIVA, ANPASSWORD
            FROM [1SEL00CONTI]
            WHERE ANCODICE = ?
        """
        cursor.execute(user_query, (ancodice,))
        user_result = cursor.fetchone()
        conn.close()
        
        if user_result is None:
            return {
                'success': False,
                'action_needed': 'error',
                'error_type': 'user_not_found',
                'message': f'Utente {ancodice} non trovato',
                'auth_method': None
            }
        
        _, user_vat, user_password = user_result
        
        # Step 2: Biforcazione basata sulla presenza della password
        if not is_password_empty_or_null(user_password):
            # RAMO A: L'utente ha una password settata
            # Usiamo direttamente user_password dalla query già fatta (efficiente)
            if verify_password(second_var, user_password):
                return {
                    'success': True,
                    'action_needed': 'login_success',
                    'error_type': None,
                    'message': 'Autenticazione con password riuscita',
                    'auth_method': 'password'
                }
            else:
                return {
                    'success': False,
                    'action_needed': 'error',
                    'error_type': 'wrong_password',
                    'message': 'Password non corretta',
                    'auth_method': 'password'
                }
        else:
            # RAMO B: L'utente NON ha una password (usa VAT legacy)
            if second_var == user_vat.strip():
                return {
                    'success': True,
                    'action_needed': 'create_password',
                    'error_type': None,
                    'message': 'Autenticazione VAT riuscita. Crea una password personalizzata.',
                    'auth_method': 'vat'
                }
            else:
                return {
                    'success': False,
                    'action_needed': 'error',
                    'error_type': 'wrong_vat',
                    'message': 'Partita IVA non corretta',
                    'auth_method': 'vat'
                }
                
    except Exception as e:
        print(f"Errore nell'autenticazione enhanced per utente {ancodice}: {e}")
        return {
            'success': False,
            'action_needed': 'error',
            'error_type': 'system_error',
            'message': f'Errore di sistema: {str(e)}',
            'auth_method': None
        }
