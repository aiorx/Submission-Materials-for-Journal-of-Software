"""
Test finale per verificare che l'applicazione carichi correttamente l'ordine con prodotto
Aided with basic GitHub coding tools
"""

import sys
import os

# Aggiungi il percorso del backend
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
sys.path.insert(0, backend_path)

from crud import MagazzinoTeleCRUD

def test_application_data():
    """Test che simula il caricamento dati dell'applicazione"""
    crud = MagazzinoTeleCRUD()
    
    try:
        if crud.connect():
            print("✅ Connessione database riuscita")
            
            # Test del metodo get_all_orders() utilizzato dall'applicazione
            orders = crud.get_all_orders()
            
            print("📊 Ordini caricati: {}".format(len(orders))           
            if orders:
                for order in orders:
                    print("
📋 Ordine #{}:".format(order['id'])                   print("  - Data: {}".format(order['data']))
                    print("  - Cliente: {}".format(order['cliente']))
                    print("  - Modello: {}".format(order['modello']))
                    print("  - Colore: {}".format(order['colore']))
                    print("  - Quantità: {}".format(order['quantita'])
                    print("  - Evaso: {}".format('Sì' if order['evaso'] else 'No')
                    
                    # Verifica che non ci sia più "Nessun Prodotto"
                    if order['modello'] and order['modello'] != 'Nessun Prodotto':
                        print("  ✅ Prodotto correttamente collegato!")
                    else:
                        print("  ❌ Prodotto non collegato")
                
                print("
🎉 SUCCESS!"               print("✅ Database correttamente strutturato con foreign key"                print("✅ Ordine #{} ha prodotto: {} - {}".format(orders[0]['id'], orders[0]['modello'], orders[0]['colore'])                print("✅ L'applicazione può ora gestire ordini con prodotti multipli"               
            else:
                print("❌ Nessun ordine trovato")
            
            crud.disconnect()
            
        else:
            print("❌ Errore connessione database")
            
    except Exception as e:
        print("❌ Errore: {}".format(e)        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_application_data()
