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
            print(f"📋 Trovati {len(ordini)} ordini nel database:")
            
            for ordine in ordini:
                print(f"  • Ordine #{ordine['id']}")
                print(f"    - Data: {ordine['data']}")
                print(f"    - Cliente: {ordine['cliente']} ({ordine['codice_cliente']})")
                print(f"    - Modello: {ordine['modello']}")
                print(f"    - Colore: {ordine['colore']}")
                print(f"    - Quantità: {ordine['quantita']}")
                print(f"    - Evaso: {'Sì' if ordine['evaso'] else 'No'}")
                print()
            
            # Test caricamento colori
            try:
                colori = crud.read_colori_schema()
                print(f"🎨 Trovati {len(colori)} colori disponibili:")
                for colore in colori[:10]:  # Mostra solo i primi 10
                    print(f"  • {colore}")
                if len(colori) > 10:
                    print(f"  ... e altri {len(colori) - 10} colori")
            except Exception as e:
                print(f"⚠️ Errore caricamento colori: {e}")
            
            crud.disconnect()
            print("✅ Test completato con successo!")
            
        else:
            print("❌ Errore connessione database")
            
    except Exception as e:
        print(f"❌ Errore durante il test: {e}")

if __name__ == "__main__":
    test_database_connection()
