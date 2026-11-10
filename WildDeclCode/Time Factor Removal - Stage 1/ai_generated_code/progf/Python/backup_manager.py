# Aided with basic GitHub coding tools
"""
Gestore avanzato per backup e ripristino del database MySQL
"""

import os
import pandas as pd
from datetime import datetime
import shutil
import threading
import time
import logging
from pathlib import Path
import mysql.connector

class BackupManager:
    """Gestisce operazioni di backup e ripristino del database"""
    
    def __init__(self):
        self.backup_base_dir = "backup"
        self.ensure_backup_directory()
        
        # Configurazione logging per operazioni
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Configurazione database (automatica dal modulo database)
        self.db_config = self._get_db_config()
    
    def ensure_backup_directory(self):
        """Crea la directory di backup se non esiste"""
        if not os.path.exists(self.backup_base_dir):
            os.makedirs(self.backup_base_dir)
    
    def _get_db_config(self):
        """Ottiene configurazione database dal modulo database"""
        try:
            # Importa configurazione dal modulo esistente
            from database import DB_CONFIG
            return DB_CONFIG
        except ImportError:
            # Configurazione di fallback (STESSI PARAMETRI di crud.py)
            return {
                'host': 'localhost',
                'user': 'root',
                'password': 'Aleselva123',  # Password corretta
                'database': 'magazzino_tele'  # Nome database corretto
            }
    
    def get_db_connection(self):
        """Ottiene connessione al database MySQL"""
        try:
            import mysql.connector
            # Crea connessione con parametri espliciti (stesso stile di crud.py)
            connection = mysql.connector.connect(
                host=self.db_config['host'],
                database=self.db_config['database'],
                user=self.db_config['user'],
                password=self.db_config['password'],
                charset='utf8mb4'  # Stesso charset di crud.py
            )
            return connection
        except ImportError:
            # Se mysql.connector non disponibile, prova con pymysql
            try:
                import pymysql
                connection = pymysql.connect(
                    host=self.db_config['host'],
                    database=self.db_config['database'],
                    user=self.db_config['user'],
                    password=self.db_config['password'],
                    charset='utf8mb4'
                )
                return connection
            except ImportError:
                raise ConnectionError("Nessun driver MySQL disponibile (mysql.connector o pymysql)")
        except Exception as e:
            self.logger.error("Errore connessione database: {}".format(e))
            raise
    
    def get_available_tables(self):
        """Ottiene lista delle tabelle disponibili nel database"""
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SHOW TABLES")
            tables = [table[0] for table in cursor.fetchall()]
            cursor.close()
            conn.close()
            return tables
        except Exception as e:
            self.logger.error("Errore nel recupero tabelle: {}".format(e))
            return []
    
    def create_backup(self, selected_tables=None, progress_callback=None):
        """
        Crea backup completo con SQL dump e file Excel
        
        Args:
            selected_tables: Lista delle tabelle da includere (None = tutte)
            progress_callback: Funzione per aggiornare progresso (progress, message)
        """
        try:
            # Crea directory con timestamp
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            backup_dir = os.path.join(self.backup_base_dir, timestamp)
            os.makedirs(backup_dir, exist_ok=True)
            
            if progress_callback:
                progress_callback(5, "Inizializzazione backup...")
            
            # Ottieni lista tabelle
            if selected_tables is None:
                selected_tables = self.get_available_tables()
            
            total_steps = len(selected_tables) + 2  # +2 per SQL dump e finalizzazione
            current_step = 1
            
            # Crea SQL dump
            if progress_callback:
                progress_callback(10, "Creazione dump SQL...")
            
            sql_file = os.path.join(backup_dir, "database_backup_{}.sql".format(timestamp))
            success = self._create_sql_dump(sql_file, selected_tables)
            
            if not success:
                raise Exception("Errore nella creazione del dump SQL")
            
            current_step += 1
            
            # Crea file Excel per ogni tabella
            excel_dir = os.path.join(backup_dir, "excel_tables")
            os.makedirs(excel_dir, exist_ok=True)
            
            for i, table in enumerate(selected_tables):
                if progress_callback:
                    progress = 10 + (80 * (i + 1) / len(selected_tables))
                    progress_callback(progress, "Esportazione tabella: {}".format(table))
                
                self._export_table_to_excel(table, excel_dir)
                time.sleep(0.1)  # Piccola pausa per aggiornamento UI
            
            # Crea file info backup
            if progress_callback:
                progress_callback(95, "Finalizzazione backup...")
            
            self._create_backup_info(backup_dir, selected_tables, timestamp)
            
            if progress_callback:
                progress_callback(100, "Backup completato: {}".format(backup_dir))
            
            return backup_dir
            
        except Exception as e:
            self.logger.error("Errore durante backup: {}".format(e))
            if progress_callback:
                progress_callback(0, "Errore: {}".format(str(e)))
            raise
    
    def _create_sql_dump(self, output_file, tables):
        """Crea dump SQL usando Python puro (senza mysqldump esterno)"""
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            with open(output_file, 'w', encoding='utf-8') as f:
                # Header del dump
                f.write("-- MySQL dump generato da Magazzino Tele\n")
                f.write("-- Data: {}
".format(datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
                f.write("-- Database: {}

".format(self.db_config['database']))
                
                f.write("SET NAMES utf8mb4;\n")
                f.write("SET time_zone = '+00:00';\n")
                f.write("SET foreign_key_checks = 0;\n")
                f.write("SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';\n\n")
                
                # Per ogni tabella
                for table in tables:
                    self.logger.info("Dump tabella: {}".format(table))
                    
                    # DROP TABLE se esiste
                    f.write("DROP TABLE IF EXISTS `{}`;
".format(table))
                    
                    # CREATE TABLE
                    cursor.execute("SHOW CREATE TABLE `{}`".format(table))
                    create_table = cursor.fetchone()
                    if create_table:
                        f.write("{};

".format(create_table[1]))
                    
                    # INSERT DATA
                    cursor.execute("SELECT * FROM `{}`".format(table))
                    rows = cursor.fetchall()
                    
                    if rows:
                        # Ottieni nomi colonne
                        cursor.execute("DESCRIBE `{}`".format(table))
                        columns = [col[0] for col in cursor.fetchall()]
                        columns_str = "`, `".join(columns)
                        
                        f.write("INSERT INTO `{}` (`{}`) VALUES
".format(table, columns_str))
                        
                        for i, row in enumerate(rows):
                            # Escape dei valori
                            escaped_values = []
                            for value in row:
                                if value is None:
                                    escaped_values.append("NULL")
                                elif isinstance(value, str):
                                    escaped_values.append("'{}'".format(value.replace(chr(39), chr(39)+chr(39))))
                                elif isinstance(value, (int, float)):
                                    escaped_values.append(str(value))
                                else:
                                    escaped_values.append("'{}'".format(str(value)))
                            
                            values_str = ", ".join(escaped_values)
                            ending = "," if i < len(rows) - 1 else ";"
                            f.write("({}){}
".format(values_str, ending))
                        
                        f.write("\n")
                
                # Footer
                f.write("SET foreign_key_checks = 1;\n")
                f.write("-- Fine dump\n")
            
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            self.logger.error("Errore in _create_sql_dump: {}".format(e))
            return False
    
    def _export_table_to_excel(self, table_name, excel_dir):
        """Esporta singola tabella in file Excel"""
        try:
            conn = self.get_db_connection()
            
            # Leggi dati tabella
            df = pd.read_sql("SELECT * FROM `{}`".format(table_name), conn)
            
            # Salva in Excel
            excel_file = os.path.join(excel_dir, "{}.xlsx".format(table_name))
            df.to_excel(excel_file, index=False, engine='openpyxl')
            
            conn.close()
            
        except Exception as e:
            self.logger.error("Errore export tabella {}: {}".format(table_name, e))
    
    def _create_backup_info(self, backup_dir, tables, timestamp):
        """Crea file informativo del backup"""
        info_file = os.path.join(backup_dir, "backup_info.txt")
        
        with open(info_file, 'w', encoding='utf-8') as f:
            f.write("Backup Database - {}
".format(timestamp))
            f.write("=" * 50 + "\n\n")
            f.write("Data/Ora: {}
".format(datetime.now().strftime('%d/%m/%Y %H:%M:%S')))
            f.write("Database: {}
".format(self.db_config['database']))
            f.write("Host: {}
".format(self.db_config['host']))
            f.write("Numero tabelle: {}

".format(len(tables)))
            f.write("Tabelle incluse:\n")
            for table in tables:
                f.write("- {}
".format(table))
            f.write("
File SQL: database_backup_{}.sql
".format(timestamp))
            f.write("File Excel: cartella excel_tables/\n")
    
    def get_available_backups(self):
        """Ottiene lista dei backup disponibili"""
        try:
            backups = []
            if not os.path.exists(self.backup_base_dir):
                return backups
            
            for item in os.listdir(self.backup_base_dir):
                backup_path = os.path.join(self.backup_base_dir, item)
                if os.path.isdir(backup_path):
                    info_file = os.path.join(backup_path, "backup_info.txt")
                    sql_file = None
                    
                    # Trova file SQL
                    for file in os.listdir(backup_path):
                        if file.endswith('.sql'):
                            sql_file = os.path.join(backup_path, file)
                            break
                    
                    if os.path.exists(info_file) and sql_file:
                        # Leggi info backup
                        with open(info_file, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        backup_info = {
                            'name': item,
                            'path': backup_path,
                            'sql_file': sql_file,
                            'info_content': content,
                            'date': self._extract_date_from_name(item)
                        }
                        backups.append(backup_info)
            
            # Ordina per data (più recenti primi)
            backups.sort(key=lambda x: x['date'], reverse=True)
            return backups
            
        except Exception as e:
            self.logger.error("Errore nel recupero backup: {}".format(e))
            return []
    
    def _extract_date_from_name(self, backup_name):
        """Estrae data dal nome del backup"""
        try:
            # Formato: YYYY-MM-DD_HH-MM-SS
            date_part = backup_name.split('_')[0]  # YYYY-MM-DD
            return datetime.strptime(date_part, "%Y-%m-%d")
        except:
            return datetime.min
    
    def restore_from_backup(self, backup_path, progress_callback=None):
        """
        Ripristina database da backup
        
        Args:
            backup_path: Percorso del backup da ripristinare
            progress_callback: Funzione per aggiornare progresso
        """
        try:
            if progress_callback:
                progress_callback(10, "Verifica file backup...")
            
            # Trova file SQL
            sql_file = None
            for file in os.listdir(backup_path):
                if file.endswith('.sql'):
                    sql_file = os.path.join(backup_path, file)
                    break
            
            if not sql_file or not os.path.exists(sql_file):
                raise Exception("File SQL non trovato nel backup")
            
            if progress_callback:
                progress_callback(30, "Preparazione ripristino...")
            
            # ATTENZIONE: Operazione distruttiva!
            # Crea backup di emergenza prima del ripristino
            emergency_backup = self._create_emergency_backup()
            
            if progress_callback:
                progress_callback(50, "Ripristino database...")
            
            # Esegui ripristino
            success = self._restore_sql_dump(sql_file)
            
            if success:
                if progress_callback:
                    progress_callback(100, "Ripristino completato con successo")
                return True
            else:
                # Ripristina backup di emergenza in caso di errore
                if emergency_backup:
                    self._restore_sql_dump(emergency_backup)
                raise Exception("Errore durante ripristino")
                
        except Exception as e:
            self.logger.error("Errore durante ripristino: {}".format(e))
            if progress_callback:
                progress_callback(0, "Errore: {}".format(str(e)))
            raise
    
    def _create_emergency_backup(self):
        """Crea backup di emergenza prima del ripristino"""
        try:
            emergency_dir = os.path.join(self.backup_base_dir, "emergency")
            os.makedirs(emergency_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            emergency_file = os.path.join(emergency_dir, "emergency_backup_{}.sql".format(timestamp))
            
            return emergency_file if self._create_sql_dump(emergency_file, None) else None
            
        except Exception as e:
            self.logger.error("Errore backup emergenza: {}".format(e))
            return None
    
    def _restore_sql_dump(self, sql_file):
        """Ripristina database da file SQL usando Python puro"""
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            # Leggi file SQL
            with open(sql_file, 'r', encoding='utf-8') as f:
                sql_content = f.read()
            
            # Dividi in statement SQL individuali
            statements = sql_content.split(';')
            
            for statement in statements:
                statement = statement.strip()
                if statement and not statement.startswith('--'):
                    try:
                        cursor.execute(statement)
                    except Exception as e:
                        # Log dell'errore ma continua (alcuni statement potrebbero fallire per motivi benigni)
                        self.logger.warning("Statement fallito (continuando): {}".format(str(e)[:100]))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            self.logger.error("Errore in _restore_sql_dump: {}".format(e))
            return False

# Istanza globale per uso nell'applicazione
backup_manager = BackupManager()
