# Aided with basic GitHub coding tools
"""
Test di connessione al database MySQL per Magazzino Tele
Esegui questo script per verificare che il database sia configurato correttamente
"""

import mysql.connector
import sys

def test_database_connection():
    """Testa la connessione al database MySQL"""
    
    # Parametri di connessione (modificare se necessario)
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'Aleselva123',
        'database': 'magazzino_tele'
    }
    
    print("🔄 Test connessione al database MySQL...")
    print("   Host: {}".format(config['host']))
    print("   Database: {}".format(config['database']))
    print("   User: {}".format(config['user']))
    print()
    
    try:
        # Prova la connessione
        connection = mysql.connector.connect(**config)
        
        if connection.is_connected():
            print("✅ Connessione riuscita!")
            
            # Verifica le tabelle
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            print("📋 Tabelle trovate ({}):".format(len(tables))           for table in tables:
                print("   - {}".format(table[0]))
            
            cursor.close()
            connection.close()
            print("\n🎉 Database configurato correttamente!")
            return True
            
    except mysql.connector.Error as e:
        print("❌ Errore di connessione: {}".format(e)        print("\n🔧 Verifica:")
        print("   1. MySQL server è in esecuzione")
        print("   2. Database 'magazzino_tele' esiste")
        print("   3. Credenziali corrette (user: root, password: Aleselva123)")
        print("   4. Host corretto (localhost)")
        return False
    
    except Exception as e:
        print("❌ Errore generale: {}".format(e)        return False

if __name__ == "__main__":
    print("=" * 60)
    print("  TEST CONNESSIONE DATABASE - MAGAZZINO TELE")
    print("=" * 60)
    print()
    
    success = test_database_connection()
    
    print("\n" + "=" * 60)
    if success:
        print("  STATUS: TUTTO OK - PUOI AVVIARE L'APPLICAZIONE")
    else:
        print("  STATUS: PROBLEMI RILEVATI - CONTROLLA LA CONFIGURAZIONE")
    print("=" * 60)
    
    input("\nPremi INVIO per chiudere...")
