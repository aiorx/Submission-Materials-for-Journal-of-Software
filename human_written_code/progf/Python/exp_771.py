# Databricks notebook source
# MAGIC %md-sandbox
# MAGIC 
# MAGIC <div style="text-align: center; line-height: 0; padding-top: 9px;">
# MAGIC   <img src="https://databricks.com/wp-content/uploads/2018/03/db-academy-rgb-1200px.png" alt="Databricks Learning" style="width: 600px">
# MAGIC </div>

# COMMAND ----------

# MAGIC %md
# MAGIC # Pre-Course Setup
# MAGIC 
# MAGIC Run this notebook just before class to ensure all assets are ready.
# MAGIC 
# MAGIC The steps include:
# MAGIC * Install the datasets to a common folder in the workspace
# MAGIC * Create 1 endpoint per user in the workspace
# MAGIC * Create 1 database per user in the workspace
# MAGIC * Grant all privileges on the database for the corresponding student (manual)
# MAGIC * Preload the table "flight_delays"

# COMMAND ----------

# MAGIC %run ./Includes/Classroom-Setup

# COMMAND ----------

DA.install_toolbox()

# COMMAND ----------

DA.print_instructions()

# COMMAND ----------

# TODO
dbutils.notebook.exit("Precluding Run-All")

# COMMAND ----------

# MAGIC %md
# MAGIC ## Pre-Load Tables
# MAGIC Run the following cell to pre-load each database with the specified table

# COMMAND ----------

DA.preload_student_databases()

# COMMAND ----------

# MAGIC %md-sandbox
# MAGIC &copy; 2022 Databricks, Inc. All rights reserved.<br/>
# MAGIC Apache, Apache Spark, Spark and the Spark logo are trademarks of the <a href="https://www.apache.org/">Apache Software Foundation</a>.<br/>
# MAGIC <br/>
# MAGIC <a href="https://databricks.com/privacy-policy">Privacy Policy</a> | <a href="https://databricks.com/terms-of-use">Terms of Use</a> | <a href="https://help.databricks.com/">Support</a>
