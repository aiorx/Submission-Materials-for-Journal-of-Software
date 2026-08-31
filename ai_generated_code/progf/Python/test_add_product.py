"""
Script per testare l'aggiunta di un prodotto all'ordine esistente
Aided with basic GitHub coding tools
"""

import sys
import os

# Aggiungi il percorso del backend
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
sys.path.insert(0, backend_path)

from crud import MagazzinoTeleCRUD

def test_add_product():
    """Test aggiunta prodotto a ordine esistente"""
    crud = MagazzinoTeleCRUD()
    
    try:
        if crud.connect():
            print("✅ Connessione database riuscita")
            
            # Verifica ordini esistenti
            ordini = crud.get_all_orders()
            print(f"📋 Ordini trovati: {len(ordini)}")
            
            if ordini:
                ordine = ordini[0]
                print(f"  - Ordine: {ordine['codice_ordine']}")
                print(f"  - Cliente: {ordine['cliente']}")
                print(f"  - Prodotti attuali: {ordine['modello'] if ordine['modello'] else 'Nessuno'}")
            
            # Prende il primo prodotto disponibile
            cursor = crud.connection.cursor()
            cursor.execute("SELECT `Codice Prodotto`, `Nome Modello`, `Nome Colore` FROM prodotti_completi LIMIT 1")
            prodotto = cursor.fetchone()
            
            if prodotto:
                codice_prodotto = prodotto[0]
                nome_modello = prodotto[1]
                nome_colore = prodotto[2]
                
                print(f"\n🧪 Test aggiunta prodotto:")
                print(f"  - Codice: {codice_prodotto}")
                print(f"  - Modello: {nome_modello}")
                print(f"  - Colore: {nome_colore}")
                
                # Aggiunge il prodotto all'ordine
                success = crud.add_product_to_order("1", codice_prodotto, 3)
                
                if success:
                    print("✅ Prodotto aggiunto con successo!")
                    
                    # Verifica il risultato
                    ordini_aggiornati = crud.get_all_orders()
                    if ordini_aggiornati:
                        ordine_aggiornato = ordini_aggiornati[0]
                        print(f"\n📋 Ordine aggiornato:")
                        print(f"  - Codice: {ordine_aggiornato['codice_ordine']}")
                        print(f"  - Cliente: {ordine_aggiornato['cliente']}")
                        print(f"  - Modello: {ordine_aggiornato['modello']}")
                        print(f"  - Colore: {ordine_aggiornato['colore']}")
                        print(f"  - Quantità: {ordine_aggiornato['quantita']}")
                        print(f"  - Evaso: {ordine_aggiornato['evaso']}")
                else:
                    print("❌ Errore nell'aggiunta del prodotto")
            
            cursor.close()
            crud.disconnect()
            
        else:
            print("❌ Errore connessione database")
            
    except Exception as e:
        print(f"❌ Errore: {e}")

if __name__ == "__main__":
    test_add_product()
