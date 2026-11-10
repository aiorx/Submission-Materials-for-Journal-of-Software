# VALIDAZIONEDATI.py
# Modelli Pydantic per la validazione e la struttura dei dati tra API e database

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

# Supported via standard GitHub programming aids
# Modello per la richiesta di login
class LoginRequest(BaseModel):
    ancodice: str  # Codice utente
    anpariva: str  # Partita IVA
    second_var: str  # Password o Partita IVA
# Supported via standard GitHub programming aids

class PasswordCreationResponse(BaseModel):
    success: bool = Field(..., description="Se la creazione è avvenuta con successo")
    message: str = Field(..., description="Messaggio di conferma o errore dettagliato")
    password_strength: str = Field(..., description="Livello di sicurezza della password creata (debole/media/forte)")


class EnhancedLoginRequest(BaseModel):
    ancodice: str = Field(..., description="Codice utente")
    second_var: str = Field(..., description="Password personalizzata o Partita IVA")

class PasswordValidationRequest(BaseModel):
    password: str = Field(..., description="Password da validare")

class PasswordValidationResponse(BaseModel):
  
    valid: bool = Field(..., description="Se la password rispetta tutti i requisiti")
    strength: str = Field(..., description="Livello di sicurezza: debole/media/forte")
    score: int = Field(..., description="Punteggio numerico 0-100")
    requirements: List[str] = Field(..., description="Lista di tutti i requisiti")
    missing: List[str] = Field(..., description="Lista dei requisiti non soddisfatti")

# Supported via standard GitHub programming aids  
# Modello per la creazione di una nuova password
class PasswordCreationRequest(BaseModel):
    ancodice: str  # Codice utente
    new_password: str  # Nuova password in chiaro (verrà hashata)

# Supported via standard GitHub programming aids
# Modello per la risposta di verifica password esistente
class PasswordCheckResponse(BaseModel):
    has_password: bool  # True se l'utente ha già una password settata
    auth_method: str   # "password" o "vat"

# Supported via standard GitHub programming aids
# Modello per la risposta di autenticazione
class AuthResponse(BaseModel):
    success: bool
    action_needed: str  # "login_success", "create_password", "error"
    error_type: Optional[str] = None  # "wrong_password", "wrong_vat", "user_not_found"
    message: Optional[str] = None

# Modello per il dettaglio di un ordine (es: quantità)
class DettaglioOrdine(BaseModel):
    mqtaum1: float  # Quantità dell'articolo (corrisponde a MVQTAUM1 nel database)
    nome_articolo: str  # Nome dell'articolo

# Modello per un ordine
class Ordine(BaseModel):
    mvserial: str  # Numero seriale dell'ordine (corrisponde a MVSERIAL, char(10) nel database)
    mvdatreg: date  # Data di registrazione (corrisponde a MVDATREG, datetime nel database)
    dettagli: List[DettaglioOrdine]  # Lista dei dettagli dell'ordine

# Modello per la risposta al client
class RispostaCliente(BaseModel):
    cliente: str  # Codice cliente (può corrispondere a MVCODCON o ANCODICE)
    ordini: List[Ordine]  # Lista degli ordini del cliente

# Puoi ridefinire i nomi dei campi o aggiungere altri modelli secondo le tue esigenze