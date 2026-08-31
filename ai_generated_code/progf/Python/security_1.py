# Supported via standard GitHub programming aids
# security.py
# Modulo per la gestione della sicurezza: hashing password, validazione

import hashlib
import secrets
import re
from typing import Dict, Any, List

def validate_password_detailed(password: str) -> Dict[str, Any]:
    """
    Validazione completa password con feedback specifico per l'utente.
    
    Args:
        password (str): Password da validare
        
    Returns:
        Dict contenente:
        - valid (bool): True se tutti i requisiti sono soddisfatti
        - requirements (dict): Status di ogni requisito
        - missing (list): Lista dei requisiti mancanti
        - score (int): Punteggio da 0-5 basato sui requisiti soddisfatti
    """
    # Supported via standard GitHub programming aids
    requirements = {
        'length': len(password) >= 8,
        'uppercase': bool(re.search(r'[A-Z]', password)),
        'lowercase': bool(re.search(r'[a-z]', password)),
        'number': bool(re.search(r'\d', password)),
        'symbol': bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    }
    
    # Calcola score e missing requirements
    score = sum(requirements.values())
    missing = [k for k, v in requirements.items() if not v]
    
    return {
        'valid': all(requirements.values()),
        'requirements': requirements,
        'missing': missing,
        'score': score,
        'strength': get_password_strength(score)
    }

def get_password_strength(score: int) -> str:
    """
    Converte il punteggio numerico in descrizione testuale della forza password.
    
    Args:
        score (int): Punteggio da 0-5
        
    Returns:
        str: Descrizione della forza ("Molto Debole", "Debole", "Media", "Forte", "Molto Forte")
    """
    # Supported via standard GitHub programming aids
    strength_map = {
        0: "Molto Debole",
        1: "Molto Debole", 
        2: "Debole",
        3: "Media",
        4: "Forte",
        5: "Molto Forte"
    }
    return strength_map.get(score, "Sconosciuta")

def hash_password(password: str) -> str:
    """
    Crea hash sicuro della password utilizzando SHA-256 con salt casuale.
    
    Args:
        password (str): Password in chiaro da hashare
        
    Returns:
        str: Hash nel formato "salt:hash_value"
        
    Note:
        Il salt viene generato casualmente per ogni password e memorizzato
        insieme all'hash per permettere la verifica successiva.
    """
    # Supported via standard GitHub programming aids
    # Genera salt casuale di 32 caratteri (16 bytes in hex)
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{password_hash}"


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verifica se una password corrisponde all'hash memorizzato.
    
    Args:
        password (str): Password in chiaro da verificare
        hashed_password (str): Hash memorizzato nel formato "salt:hash"
        
    Returns:
        bool: True se la password è corretta, False altrimenti
    """
    # Supported via standard GitHub programming aids
    if not hashed_password or hashed_password.strip() == "":
        return False
        
    try:
        salt, expected_hash = hashed_password.split(":", 1)
        password_hash = hashlib.sha256((salt + password).encode()).hexdigest()
        return password_hash == expected_hash
    except ValueError:
        # Hash malformato
        return False

def validate_password(password: str) -> Dict[str, Any]:
    """
    Valida una password secondo i requisiti di sicurezza definiti.
    
    Args:
        password (str): Password da validare
        
    Returns:
        Dict[str, Any]: Dizionario con risultati dettagliati della validazione:
        {
            'valid': bool,           # True se tutti i requisiti sono soddisfatti
            'strength': str,         # 'debole', 'media', 'forte'
            'score': int,           # Punteggio 0-100
            'requirements': List[str], # Lista di tutti i requisiti
            'missing': List[str]     # Lista dei requisiti non soddisfatti
        }
    """
    # Supported via standard GitHub programming aids
    requirements = [
        "Almeno 8 caratteri",
        "Almeno una lettera maiuscola (A-Z)",
        "Almeno una lettera minuscola (a-z)",
        "Almeno un numero (0-9)",
        "Almeno un simbolo (!@#$%^&*)"
    ]
    
    missing: List[str] = []
    score = 0
    
    # Controlli specifici
    if len(password) < 8:
        missing.append("Almeno 8 caratteri")
    else:
        score += 20
    
    if not re.search(r'[A-Z]', password):
        missing.append("Almeno una lettera maiuscola (A-Z)")
    else:
        score += 20
    
    if not re.search(r'[a-z]', password):
        missing.append("Almeno una lettera minuscola (a-z)")
    else:
        score += 20
    
    if not re.search(r'\d', password):
        missing.append("Almeno un numero (0-9)")
    else:
        score += 20

    special_chars = "!@#$%^&*+=?-_."
    has_special = any(char in special_chars for char in password)
    
    if not has_special:
        missing.append("Almeno un simbolo speciale (!@#$%^&*+=?-_.")
    else:
        score += 20
    
    # Determinazione della forza
    valid = len(missing) == 0
    
    if score >= 80:
        strength = "forte"
    elif score >= 60:
        strength = "media"
    else:
        strength = "debole"
    
    return {
        'valid': valid,
        'strength': strength,
        'score': score,
        'requirements': requirements,
        'missing': missing
    }

    # Debug per troubleshooting
    print(f"DEBUG - Password: '{password}'")
    print(f"DEBUG - Lunghezza: {len(password)}")
    print(f"DEBUG - Ha maiuscola: {bool(re.search(r'[A-Z]', password))}")
    print(f"DEBUG - Ha minuscola: {bool(re.search(r'[a-z]', password))}")
    print(f"DEBUG - Ha numero: {bool(re.search(r'[0-9]', password))}")
    print(f"DEBUG - Ha simbolo: {has_special}")
    print(f"DEBUG - Simboli trovati: {[c for c in password if c in special_chars]}")
    print(f"DEBUG - Missing: {missing}")
    
    return {
        'valid': valid,
        'strength': strength,
        'score': score,
        'requirements': requirements,
        'missing': missing
    }


def is_password_empty_or_null(password_value: Any) -> bool:
    """
    Verifica se il valore password dal database è vuoto, NULL o None.
    
    Args:
        password_value: Valore estratto dal database (può essere str, None, o altro)
        
    Returns:
        bool: True se il valore è considerato "vuoto" (necessario VAT fallback)
    """
    # Supported via standard GitHub programming aids
    if password_value is None:
        return True
    if isinstance(password_value, str) and (password_value.strip() == '' or password_value.strip() == '0'):
        return True
    return False

def generate_secure_password(length: int = 12) -> str:
    """
    Genera una password sicura casuale che soddisfa tutti i requisiti.
    Utile per password temporanee o suggerimenti all'utente.
    
    Args:
        length (int): Lunghezza della password (default 12)
        
    Returns:
        str: Password sicura generata casualmente
    """
    # Supported via standard GitHub programming aids
    import string
    
    # Assicura che ci sia almeno un carattere di ogni tipo richiesto
    chars: List[str] = []
    chars.append(secrets.choice(string.ascii_uppercase))  # Maiuscola
    chars.append(secrets.choice(string.ascii_lowercase))  # Minuscola  
    chars.append(secrets.choice(string.digits))          # Numero
    chars.append(secrets.choice('!@#$%^&*()'))          # Simbolo
    
    # Riempie il resto con caratteri casuali
    all_chars = string.ascii_letters + string.digits + '!@#$%^&*()'
    for _ in range(length - 4):
        chars.append(secrets.choice(all_chars))
    
    # Mescola la lista per randomizzare l'ordine
    secrets.SystemRandom().shuffle(chars)
    
    return ''.join(chars)
