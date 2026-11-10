"""
USAGE:
spark-submit 3B.py ratings.csv --bucket_length 0.01 --num_hash_tables 30 --distance_threshold 0.7

This script implements a recommender system using Locality Sensitive Hashing (LSH) with PySpark.

It reads a ratings dataset, computes baseline ratings, builds sparse vectors for movies, applies LSH for approximate similarity joins,
and predicts ratings for movies in the test set based on similar movies from the training set.

This script is designed to be run in a PySpark environment, and it requires the PySpark library to be installed.

Author: Diogo Marto NºMec: 108298
Code made with the help of Github Copilot.
"""

import argparse
import collections
import os
import time

from pyspark.sql import SparkSession, DataFrame
from pyspark.ml.feature import BucketedRandomProjectionLSH
from pyspark.ml.linalg import SparseVector, VectorUDT, Vectors
from pyspark.sql.functions import col, collect_list, struct, udf, avg, max, sum as spark_sum, lit , coalesce
from pyspark.sql.types import FloatType, ArrayType, StructType, StructField, IntegerType

def main(file_path: str, bucket_length: float, num_hash_tables: int, distance_threshold: float, discard: int):
    # os.environ['PYSPARK_PYTHON'] = '.venv/Scripts/python.exe'
    # os.environ['PYSPARK_DRIVER_PYTHON'] = '.venv/Scripts/python.exe'

    spark: SparkSession = SparkSession.builder \
        .appName(f"LSH MovieLens Recommender (file: {os.path.basename(file_path)})") \
        .getOrCreate()

    sc = spark.sparkContext
    sc.setLogLevel("WARN")

    print(f"Starting LSH Recommender with parameters:")
    print(f"  File Path: {file_path}")
    print(f"  Bucket Length: {bucket_length}")
    print(f"  Num Hash Tables: {num_hash_tables}")
    print(f"  Distance Threshold (Cosine Similarity): {distance_threshold}")

    ratings_df = spark.read.csv(file_path, header=True, inferSchema=True) \
    .drop("timestamp")
    print("Number of ratings:", ratings_df.count())

    train_df, test_df = ratings_df.randomSplit([0.9, 0.1], seed=42)

    avg_rating_val = train_df.agg(avg("rating")).collect()[0][0]

    rating_deviation_of_user_df = train_df.groupBy("userId") \
        .agg(avg("rating").alias("avg_user_rating")) \
        .withColumn("rating_deviation_user", col("avg_user_rating") - lit(avg_rating_val)) \
        .select("userId", "rating_deviation_user")

    rating_deviation_of_movie_df = train_df.groupBy("movieId") \
        .agg(avg("rating").alias("avg_movie_rating")) \
        .withColumn("rating_deviation_movie", col("avg_movie_rating") - lit(avg_rating_val)) \
        .select("movieId", "rating_deviation_movie")
    
    rating_deviation_of_user_df.cache()
    rating_deviation_of_movie_df.cache()

    train_df = train_df.join(rating_deviation_of_user_df, "userId", "left_outer") \
                       .join(rating_deviation_of_movie_df, "movieId", "left_outer") \
                       .withColumn("rating_deviation_user", coalesce(col("rating_deviation_user"), lit(0.0))) \
                       .withColumn("rating_deviation_movie", coalesce(col("rating_deviation_movie"), lit(0.0))) \
                       .withColumn("baseline_rating", 
                                   lit(avg_rating_val) + col("rating_deviation_user") + col("rating_deviation_movie")) \
                       .drop("rating_deviation_user", "rating_deviation_movie", "avg_user_rating", "avg_movie_rating") 
                       
    def calculate_rmse(predictions):
        rmse = predictions.withColumn(
            "squared_error",
            (col("actual_rating") - col("predicted_rating")) ** 2
        ).agg({"squared_error": "avg"}).collect()[0][0] ** 0.5
        return rmse

    max_user_id = train_df.select(max("userId")).collect()[0][0]
    length_user = max_user_id + 1  # Assuming userId starts from 0
    @udf(returnType=VectorUDT())
    def build_sparse_vector(ratings_list):
        if not ratings_list:
            return Vectors.sparse(length_user, [], [])
            
        user_rating_map = collections.OrderedDict(sorted([(r[0], r[1]) for r in ratings_list]))
        user_ids = [int(k) for k in user_rating_map.keys()] # Ensure integer indices
        values = list(user_rating_map.values())
        return Vectors.sparse(length_user, user_ids, values)

    sparse_vector_df = train_df.groupBy("movieId") \
        .agg(collect_list(struct("userId", "rating")).alias("ratings")) \
        .select("movieId", build_sparse_vector(col("ratings")).alias("ratings_vector"))
        
        
    @udf(returnType=IntegerType())
    def get_num_ratings(vector: SparseVector):
        return len(vector.values)
    sparse_vector_df = sparse_vector_df.withColumn(
        "num_ratings",
        get_num_ratings(col("ratings_vector"))
    ).filter(col("num_ratings") >= discard) \
    .drop("num_ratings")
    
    @udf(returnType=VectorUDT())
    def normalize_vector(vector: SparseVector):
        if vector is None or vector.values.size == 0:
            return vector # or an empty vector of same size: Vectors.sparse(vector.size, [], [])
        
        mean_val = vector.values.mean()
        new_values = vector.values - mean_val
        norm_val = (new_values.dot(new_values)) ** 0.5
        
        if norm_val == 0.0:
            norm_val = vector.norm(2)  # Fallback to L2 norm if the new values are all zero
            return Vectors.sparse(
                vector.size,
                vector.indices,
                vector.values / norm_val
            )
            
        return Vectors.sparse(
            vector.size,
            vector.indices,
            new_values / norm_val
        )

    df = sparse_vector_df.withColumn(
        "features",
        normalize_vector(col("ratings_vector"))
    )

    brp = BucketedRandomProjectionLSH(
        inputCol="features",
        outputCol="hashes",
        bucketLength=bucket_length,
        numHashTables=num_hash_tables,
        seed=42
    )
    
    print("\nFitting LSH model...")
    model = brp.fit(df)
    transformed_df = model.transform(df)
    
    test_df_with_baseline = test_df.withColumnRenamed("rating", "actual_rating") \
                                   .join(rating_deviation_of_user_df, "userId", "left_outer") \
                                   .join(rating_deviation_of_movie_df, "movieId", "left_outer") \
                                   .withColumn("rating_deviation_user", coalesce(col("rating_deviation_user"), lit(0.0))) \
                                   .withColumn("rating_deviation_movie", coalesce(col("rating_deviation_movie"), lit(0.0))) \
                                   .withColumn("baseline_rating", 
                                               lit(avg_rating_val) + col("rating_deviation_user") + col("rating_deviation_movie")) \
                                   .drop("rating_deviation_user", "rating_deviation_movie", "avg_user_rating", "avg_movie_rating") # Clean up

    test_movies_features = test_df_with_baseline.select("movieId").distinct() \
        .join(transformed_df.select("movieId", "features"), "movieId", "inner") \
        .withColumnRenamed("movieId", "test_movieId") \
        .withColumnRenamed("features", "features")
    distance_threshold_euclidean = (2 - 2 * distance_threshold) ** 0.5
    print(f"Euclidean distance threshold for LSH join: {distance_threshold_euclidean}")

    print("Performing approximate similarity join...") 
    similar_movies_for_test = model.approxSimilarityJoin(
        test_movies_features,
        transformed_df.select("movieId", "features"),
        distance_threshold_euclidean,
        distCol="raw_distance"
    )

    predicted_ratings_prep = similar_movies_for_test \
        .withColumn("similarity", lit(1.0) - (col("raw_distance") ** 2 / lit(2.0))) \
        .filter(col("similarity") > lit(distance_threshold)) \
        .filter(col("datasetA.test_movieId") != col("datasetB.movieId")) \
        .select(
            col("datasetA.test_movieId").alias("movieId"), # The movie from the test set
            col("datasetB.movieId").alias("similar_movieId"), # A movie similar to the test movie (from train set)
            "similarity"
        )

    predictions_with_test_info = test_df_with_baseline.alias("td") \
        .join(predicted_ratings_prep.alias("prp"), col("td.movieId") == col("prp.movieId"), "inner") \
        .select(
            col("td.userId"),
            col("td.movieId"),
            col("td.actual_rating"),
            col("td.baseline_rating"),
            col("prp.similar_movieId"),
            col("prp.similarity")
        )

    final_predictions_data = predictions_with_test_info.alias("pti") \
        .join(
            train_df.alias("trd"), # train_df already has 'baseline_rating' for (user, similar_movie)
            (col("pti.userId") == col("trd.userId")) & \
            (col("pti.similar_movieId") == col("trd.movieId")),
            "inner"
        ) \
        .select(
            col("pti.userId"),
            col("pti.movieId"), # Target movie
            col("pti.actual_rating"),
            col("pti.baseline_rating").alias("target_movie_baseline_rating"), # Baseline for target (user, movie)
            col("pti.similarity"),
            col("trd.rating").alias("similar_movie_actual_rating"), # Actual rating user gave to similar movie
            col("trd.baseline_rating").alias("similar_movie_baseline_rating") # Baseline for (user, similar_movie)
        )

    # Sum of (r_uj - b_uj) * sim(i,j) / Sum of sim(i,j)
    # where r_uj is rating for similar movie j, b_uj is baseline for similar movie j
    # sim(i,j) is similarity between target movie i and similar movie j
    final_lsh_predicted_ratings_df = final_predictions_data \
        .withColumn("norm_rating_times_sim", 
                    (col("similar_movie_actual_rating") - col("similar_movie_baseline_rating")) * col("similarity")) \
        .groupBy("userId", "movieId", "actual_rating", "target_movie_baseline_rating") \
        .agg(
            (spark_sum("norm_rating_times_sim") / spark_sum(col("similarity"))).alias("weighted_normalized_offset")
        ) \
        .withColumn("predicted_rating", col("target_movie_baseline_rating") + col("weighted_normalized_offset")) \
        .select("userId", "movieId", "actual_rating", "predicted_rating")
    

    movies_with_only_baseline_prediction = test_df_with_baseline.alias("td") \
        .join(final_lsh_predicted_ratings_df.alias("fpd"),
              (col("td.userId") == col("fpd.userId")) & (col("td.movieId") == col("fpd.movieId")),
              "left_anti") \
        .select(
            col("td.userId"),
            col("td.movieId"),
            col("td.actual_rating"),
            col("td.baseline_rating").alias("predicted_rating") # Use baseline as prediction
        )

    full_predicted_ratings_df = final_lsh_predicted_ratings_df.unionByName(movies_with_only_baseline_prediction)
    
    rmse_lsh = calculate_rmse(full_predicted_ratings_df)        
    print(f"\n--- Final RMSE of LSH-based model on test set: {rmse_lsh} ---")        
    predictions_output_path = f"predictions_{os.path.basename(file_path).split('.')[0]}_bl{bucket_length}_nht{num_hash_tables}_dt{distance_threshold}"        
    print(f"Saving predictions to {predictions_output_path}")        
    full_predicted_ratings_df.toPandas().to_csv(f"{predictions_output_path}.csv", index=False)
    train_df.unpersist()
    test_df.unpersist()
    sparse_vector_df.unpersist()
    test_df_with_baseline.unpersist()
    final_lsh_predicted_ratings_df.unpersist()
    full_predicted_ratings_df.unpersist()
    
    print("\nStopping Spark session.")
    spark.stop()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PySpark LSH Recommender")
    parser.add_argument("file_path", type=str, help="Path to the ratings.csv file")
    parser.add_argument("--bucket_length", type=float, default=0.01, help="Bucket length for LSH")
    parser.add_argument("--num_hash_tables", type=int, default=30, help="Number of hash tables for LSH")
    parser.add_argument("--distance_threshold", type=float, default=0.7, 
                        help="Cosine similarity threshold for considering movies similar (0 to 1)")
    parser.add_argument("--discard", type=int, default=5, help="Minimum number of ratings for a movie to be considered in LSH")
    
    args = parser.parse_args()

    if not (0 < args.distance_threshold <= 1):
        raise ValueError("Distance threshold must be between 0 (exclusive) and 1 (inclusive).")

    main(args.file_path, args.bucket_length, args.num_hash_tables, args.distance_threshold,args.discard)