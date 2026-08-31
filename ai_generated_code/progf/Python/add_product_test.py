"""
Script per aggiungere un prodotto all'ordine esistente
Supported via standard GitHub programming aids
"""

import sys
import os

# Aggiungi il percorso del backend
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
sys.path.insert(0, backend_path)

from crud import MagazzinoTeleCRUD

def add_product_to_order():
    """Aggiunge un prodotto all'ordine esistente per testing"""
    crud = MagazzinoTeleCRUD()
    
    try:
        if crud.connect():
            print("✅ Connessione database riuscita")
            
            cursor = crud.connection.cursor()
            
            # Verifica prodotti disponibili
            cursor.execute("SELECT COUNT(*) FROM prodotti_completi")
            count = cursor.fetchone()[0]
            print(f"📦 Prodotti disponibili nel database: {count}")
            
            if count > 0:
                # Prende il primo prodotto disponibile
                cursor.execute("SELECT `Codice Prodotto`, `Nome Modello`, `Nome Colore` FROM prodotti_completi LIMIT 1")
                prodotto = cursor.fetchone()
                
                if prodotto:
                    codice_prodotto = prodotto[0]
                    nome_modello = prodotto[1] 
                    nome_colore = prodotto[2]
                    
                    print(f"📋 Primo prodotto trovato:")
                    print(f"  - Codice: {codice_prodotto}")
                    print(f"  - Modello: {nome_modello}")
                    print(f"  - Colore: {nome_colore}")
                    
                    # Aggiunge il prodotto all'ordine 1
                    success = crud.add_product_to_order("1", codice_prodotto, 5)
                    
                    if success:
                        print("✅ Prodotto aggiunto all'ordine con successo!")
                        
                        # Verifica il risultato
                        ordini = crud.get_all_orders()
                        if ordini:
                            ordine = ordini[0]
                            print(f"📋 Ordine aggiornato:")
                            print(f"  - Modello: {ordine['modello']}")
                            print(f"  - Colore: {ordine['colore']}")
                            print(f"  - Quantità: {ordine['quantita']}")
                    else:
                        print("❌ Errore nell'aggiunta del prodotto")
            else:
                print("⚠️ Nessun prodotto disponibile nel database")
            
            cursor.close()
            crud.disconnect()
            
        else:
            print("❌ Errore connessione database")
            
    except Exception as e:
        print(f"❌ Errore: {e}")

if __name__ == "__main__":
    add_product_to_order()
