# Assisted using common GitHub development utilities

# Flask-Bibliothek importieren
from flask import Flask

# Modul für Datum und Uhrzeit importieren
from datetime import datetime

# Flask-Anwendung initialisieren
anwendung = Flask(__name__)

# Route für /now definieren
@anwendung.route('/now')
def aktuelle_zeit():
    # Aktuelles Datum und Uhrzeit abrufen
    jetzt = datetime.now()
    # Datum und Uhrzeit als String formatieren
    antwort = jetzt.strftime("%Y-%m-%d %H:%M:%S")
    # Antwort zurückgeben
    return antwort

# Anwendung starten, wenn das Skript direkt ausgeführt wird
if __name__ == '__main__':
    # Server starten
    anwendung.run()
