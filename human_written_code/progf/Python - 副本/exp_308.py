# -*- coding: utf-8 -*-
"""
Created on Thu Mar 21 14:49:01 2019

@author: Cédric Berteletti

Given a raw folders containing different sub-folders of images to classify,
generate two subfolders for the training and test datasets for training,
for example, a Convolutional Neural Network

Usage examples :
_ by command line :
    python dataset_splitter.py --raw_path "dataset/raw_set" --test_path "dataset/test_set"
        --training_path "dataset/training_set" --training_percentage 80
_ or directly setting the parameters with the global constants
    and starting the script without command line parameters
"""


import argparse
import os
import shutil
import numpy as np
from random import sample


BASE_PATH = "dataset"
RAW_DATASET_PATH = "raw_set"
TEST_DATASET_PATH = "test_set"
TRAINING_DATASET_PATH = "training_set"
TRAINING_POURCENTAGE = 80


def split_dataset(raw_path, test_path, training_path, training_percentage):
    for subfolder in os.listdir(raw_path):
        if os.path.isdir(os.path.join(raw_path, subfolder)):
            split_folder(os.path.join(raw_path, subfolder),
                         os.path.join(test_path, subfolder),
                         os.path.join(training_path, subfolder),
                         training_percentage)


def split_folder(source_path, dest1_path, dest2_path, dest2_percentage):
    if not os.path.exists(dest1_path):
        os.makedirs(dest1_path)
    if not os.path.exists(dest2_path):
        os.makedirs(dest2_path)
    print("Splitting folder ", source_path)

    # list all files in the source folder
    files = []
    for file in os.listdir(source_path):
        if os.path.isfile(os.path.join(source_path, file)):
            #print("    ", file)
            files.append(file)
    #print(files)

    # random samples of the files by indices
    nb_total = len(files) #length of data
    nb_dest2 = int(dest2_percentage * nb_total / 100)
    indices = sample(range(nb_total), nb_dest2)
    #print(indices)
    all_files = np.array(files)
    dest2_files = all_files[indices]
    dest1_files = np.delete(all_files, indices)
    #print(dest1_files)
    #print(dest2_files)

    # copy the two subset
    for file in dest1_files:
        shutil.copy(os.path.join(source_path, file), os.path.join(dest1_path, file))
    for file in dest2_files:
        shutil.copy(os.path.join(source_path, file), os.path.join(dest2_path, file))


def main(args):
    # parse the command line parameters, if any, default if not
    parser = argparse.ArgumentParser(description="Scrape Google images")
    parser.add_argument("-r", "--raw_path",
                        default=os.path.join(BASE_PATH, RAW_DATASET_PATH), type=str,
                        help="Path for the raw images")
    parser.add_argument("-s", "--test_path",
                        default=os.path.join(BASE_PATH, TEST_DATASET_PATH), type=str,
                        help="Path for the test images")
    parser.add_argument("-t", "--training_path",
                        default=os.path.join(BASE_PATH, TRAINING_DATASET_PATH), type=str,
                        help="Path for the training images")
    parser.add_argument("-p", "--training_percentage", default=TRAINING_POURCENTAGE, type=int,
                        help="Percentage of the images used for the training set")
    args = parser.parse_args()
    raw_path = args.raw_path
    test_path = args.test_path
    training_path = args.training_path
    training_percentage = args.training_percentage

    split_dataset(raw_path, test_path, training_path, training_percentage)



if __name__ == "__main__":
    from sys import argv
    try:
        main(argv)
    except KeyboardInterrupt:
        pass
