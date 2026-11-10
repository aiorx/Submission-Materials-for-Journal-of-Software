import logging, os
from pyspark.sql import SparkSession


def get_environ():
    """Returns the environment passed using OS environment variable"""
    return os.environ.get('ETL_PYSPARK_ENV')


def get_spark_session(report_name):
    """Build Spark Session Object"""
    etl_pyspark_env = get_environ()
    spark = None
    try:
        if etl_pyspark_env == 'local':
            spark = SparkSession. \
                builder. \
                master('local'). \
                appName("ETL Pyspark:{}".format(report_name)). \
                enableHiveSupport(). \
                getOrCreate()
        elif etl_pyspark_env == 'yarn':
            spark = SparkSession. \
                builder. \
                master('yarn'). \
                appName("ETL Pyspark:{}".format(report_name)). \
                enableHiveSupport(). \
                getOrCreate()
        elif etl_pyspark_env == 'db':
            spark = SparkSession. \
                builder. \
                appName("ETL Pyspark:{}".format(report_name)). \
                enableHiveSupport(). \
                getOrCreate()
        spark.sparkContext.setLogLevel('ERROR')
        spark.conf.set('spark.sql.shuffle.partitions', '2')
        spark.conf.set('hive.exec.dynamic.partition.mode', 'nonstrict')
    except Exception as e:
        logging.error(e)
    return spark


def execute_query(spark, report_name, query_name, query, batch_month):
    """Executes the query based up on the report and query passed"""
    try:
        logging.info("Running query {} for {}".format(query_name, report_name))
        statement = query.format(batch_month=batch_month)
        spark.sql(statement)
    except Exception as e:
        logging.error(e)
        raise


def execute_report(spark, reports, report_name, batch_month):
    """Processes all the queries for a given report"""
    logging.info("Processing data for report {}".format(report_name))
    report_queries = reports[report_name]
    for query in report_queries:
        for key in query:
            execute_query(spark, report_name, key, query[key], batch_month)
