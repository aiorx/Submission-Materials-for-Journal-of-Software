"""
Script per verificare la struttura delle tabelle ordini e ordiniprodotti
Assisted using common GitHub development utilities
"""

import sys
import os

# Aggiungi il percorso del backend
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
sys.path.insert(0, backend_path)

from crud import MagazzinoTeleCRUD

def check_tables_structure():
    """Verifica la struttura delle tabelle ordini e ordiniprodotti"""
    crud = MagazzinoTeleCRUD()
    
    try:
        if crud.connect():
            print("✅ Connessione database riuscita")
            
            cursor = crud.connection.cursor()
            
            # Struttura tabella ordini
            print("\n📋 Struttura tabella 'ordini':")
            cursor.execute("DESCRIBE ordini")
            columns = cursor.fetchall()
            for col in columns:
                print("  - {}: {} {}".format(col[0], col[1], 'NULL' if col[2] == 'YES' else 'NOT NULL'))
            
            # Dati tabella ordini
            cursor.execute("SELECT * FROM ordini")
            ordini_data = cursor.fetchall()
            print("
📊 Record in ordini: {}".format(len(ordini_data))           for row in ordini_data:
                print("  {}".format(row))
            
            # Struttura tabella ordiniprodotti
            print("\n📋 Struttura tabella 'ordiniprodotti':")
            cursor.execute("DESCRIBE ordiniprodotti")
            columns = cursor.fetchall()
            for col in columns:
                print("  - {}: {} {}".format(col[0], col[1], 'NULL' if col[2] == 'YES' else 'NOT NULL'))
            
            # Dati tabella ordiniprodotti
            cursor.execute("SELECT * FROM ordiniprodotti")
            ordiniprodotti_data = cursor.fetchall()
            print("
📊 Record in ordiniprodotti: {}".format(len(ordiniprodotti_data))           for row in ordiniprodotti_data:
                print("  {}".format(row))
            
            # Verifica chiavi di collegamento
            print("\n🔍 Analisi chiavi di collegamento:")
            if ordini_data:
                ordine_key = ordini_data[0][0]  # Prima colonna della tabella ordini
                print("  - Chiave ordine: {} (tipo: {})".format(ordine_key, type(ordine_key)))
            
            if ordiniprodotti_data:
                for row in ordiniprodotti_data:
                    ordine_prodotti_key = row[2]  # Terza colonna dovrebbe essere 'codice ordine'
                    print("  - Chiave ordiniprodotti: {} (tipo: {})".format(ordine_prodotti_key, type(ordine_prodotti_key)))
            
            cursor.close()
            crud.disconnect()
            
        else:
            print("❌ Errore connessione database")
            
    except Exception as e:
        print("❌ Errore: {}".format(e)
if __name__ == "__main__":
    check_tables_structure()
