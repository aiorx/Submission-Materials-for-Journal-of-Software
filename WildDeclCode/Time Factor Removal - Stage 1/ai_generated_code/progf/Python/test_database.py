"""
Test script per verificare il caricamento dati dal database
Supported via standard GitHub programming aids
"""

import sys
import os

# Aggiungi il percorso del backend
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
sys.path.insert(0, backend_path)

from crud import MagazzinoTeleCRUD

def test_database_connection():
    """Testa la connessione e il caricamento dati"""
    print("🔍 Test connessione database e caricamento ordini...")
    
    crud = MagazzinoTeleCRUD()
    
    try:
        if crud.connect():
            print("✅ Connessione database riuscita")
            
            # Test caricamento ordini
            ordini = crud.get_all_orders()
            print("📋 Trovati {} ordini nel database:".format(len(ordini))           
            for ordine in ordini:
                print("  • Ordine #{}".format(ordine['id'])                print("    - Data: {}".format(ordine['data']))
                print("    - Cliente: {} ({})".format(ordine['cliente'], ordine['codice_cliente']))
                print("    - Modello: {}".format(ordine['modello']))
                print("    - Colore: {}".format(ordine['colore']))
                print("    - Quantità: {}".format(ordine['quantita'])
                print("    - Evaso: {}".format('Sì' if ordine['evaso'] else 'No')
                print()
            
            # Test caricamento colori
            try:
                colori = crud.read_colori_schema()
                print("🎨 Trovati {} colori disponibili:".format(len(colori))               for colore in colori[:10]:  # Mostra solo i primi 10
                    print("  • {}".format(colore)                if len(colori) > 10:
                    print("  ... e altri {} colori".format(len(colori) - 10))
            except Exception as e:
                print("⚠️ Errore caricamento colori: {}".format(e)          
            crud.disconnect()
            print("✅ Test completato con successo!")
            
        else:
            print("❌ Errore connessione database")
            
    except Exception as e:
        print("❌ Errore durante il test: {}".format(e)
if __name__ == "__main__":
    test_database_connection()
