# Copyright 2025 Anton Rudchenko
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import serial, requests
import time
import threading
import joblib
import time, os, math, csv
import numpy as np
import pandas as pd

from CodeLibrary.sw_functions_for_macros import *
from CodeLibrary.sw_algorithms import *
from CodeLibrary.csv_functions import *

from Data.poses_to_validate import poses

assembly_path = os.path.abspath("Assembly\\Assembly.SLDASM")
get_cords = os.path.abspath("Macros\\xyz_coord.swp")
rot_comp = os.path.abspath("Macros\\rot_components.swp")
change_mate = os.path.abspath("Macros\\ChangeMateValue.swp")
change_mate_stack = os.path.abspath("Macros\\ChangeMateValueStack.swp")
check_value = os.path.abspath("Macros\\CheckMateValue.swp")
check_stack = os.path.abspath("Macros\\CheckMateValueStack.swp")
check_errors = os.path.abspath("Macros\\CheckForErrors.swp")
check_coll = os.path.abspath("Macros\\CheckForCollision.swp")
mate_list = ['Distance40', 'Distance41', 'Distance42', 'Distance43', 'Distance44']



# This function was Composed with basic coding tools
def compare_poses(pose1, pose2, tolerance=1e-2):
    if len(pose1) != 6 or len(pose2) != 6:
        raise ValueError("Both poses must be lists of 6 values: [x, y, z, rx, ry, rz]")

    labels = ['x', 'y', 'z', 'rx', 'ry', 'rz']
    per_value_accuracy = []

    for a, b in zip(pose1, pose2):
        diff = abs(a - b)
        if abs(a) > tolerance:
            acc = max(0.0, 100 - (diff / abs(a)) * 100)
        else:
            acc = 100.0 if diff < tolerance else max(0.0, 100 - diff * 100)
        per_value_accuracy.append(acc)

    # Overall normalized accuracy (Euclidean distance)
    distance = math.sqrt(sum((a - b) ** 2 for a, b in zip(pose1, pose2)))
    norm = math.sqrt(sum(a ** 2 for a in pose1)) + 1e-8  # avoid divide by zero
    overall_accuracy = 100 * (1 - distance / norm)

    # Print results
    #print(f"\nTarget pose:\n  {pose1}")
    #print(f"Predicted pose:\n  {pose2}")
    print(f"\nOverall accuracy: {overall_accuracy:.2f}%")
    for label, acc in zip(labels, per_value_accuracy):
        #print(f"{label}: {acc:.2f}% match")
        pass

    return overall_accuracy#, dict(zip(labels, per_value_accuracy))

# This one also
def log_poses_to_csv(target_pose, simulation_pose, aruco_pose, filepath='Data\\poses_log.csv'):
    headers = [
        'target_x', 'target_y', 'target_z', 'target_rx', 'target_ry', 'target_rz',
        'simulation_x', 'simulation_y', 'simulation_z', 'simulation_rx', 'simulation_ry', 'simulation_rz',
        'prototype_x', 'prototype_y', 'prototype_z', 'prototype_rx', 'prototype_ry', 'prototype_rz'
    ]

    def clean(pose):
        if not pose or len(pose) != 6:
            return ['None'] * 6
        return [str(v) if v is not None else 'None' for v in pose]

    row = clean(target_pose) + clean(simulation_pose) + clean(aruco_pose)

    file_exists = os.path.isfile(filepath)

    with open(filepath, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(headers)
        writer.writerow(row)

def get_pose_web(sip="192.168.12.102"):
    response = requests.get(f"http://{sip}:5000/latest")
    pose = response.json()
    pose_list = [
        pose["dx"],
        pose["dy"],
        pose["dz"],
        pose["rx"],
        pose["ry"],
        pose["rz"]
    ]
    return pose_list

# This one is mine :3
def validate_pose(target_pose = [0, 150, 0, 0, 0, 0], ver=3):
    status = 0

    pth = os.path.abspath(f'Data/PF_model_degree_{ver}.pkl')
    # Simulation system initialization
    initialization()
    open_assembly(assembly_path)

    # Load model
    model = joblib.load(pth)

    input_data = pd.DataFrame([target_pose], columns=['X', 'Y', 'Z', 'RX', 'RY', 'RZ'])
    prediction = list(model.predict(input_data)[0].round(2))

    if any(n < 0 for n in prediction) or any(n > 111 for n in prediction):
        print("CONFIGURATION IS OUT OF BOUNDS!")
        status = 1
        return [999, 999, 999, 999, 999, 999]

    if status != 1:
        change_mate_distance_stack(change_mate_stack, mate_list, prediction)
        print('\n'+'*'*50)
        prblms = check_for_troubles()

    if prblms != True:
        status = 2

    sim_pose = collect_tool_data()[5:]
    sim_pose = [round(num, 2) for num in sim_pose] 
    print('*'*50)
    print(f'\nPredicted ML configuration:\n  {prediction}\n\nFor target pose:\n  {target_pose}')
    print(f'Simulated pose for predicted configuration:\n  {sim_pose}')
    print('\n')

    compare_poses(target_pose, sim_pose)

    if status == 0:
        return sim_pose, prediction
    else:
        return [999, 999, 999, 999, 999, 999]



############# Server IP and BT adress
nuc_ip_adress = "192.168.95.102"
com_port = "COM4"

############# Some printing
print("Author: Anton Rudchenko\nMachine Learning validation system v1.2\n")
print("Possible scenarios:\n - 1 -- going to neutral pose in the simulation system;\n - 2 -- validation via simulation system only;\n - 3 -- validation via simulation system and via physical prototype.\n")

############# Scenario selection
try:
    test_case = int(input("Please, enter required validation type number: "))
    print("\n")
except:
    input("\nIncorrect request!")

if test_case == 1: # Just to get to neutral pose in simulation, may not work btw
    validate_pose()
    print(check_for_errors(check_errors))

if test_case == 2: # Validation via simulation only
    for i in range(len(poses)):
        print('#'*20 + f' Pose #{i+1}  ' + '#'*20)
        target_pose = poses[i]
        simulation_pose = validate_pose(target_pose)
        log_poses_to_csv(target_pose, simulation_pose, aruco_pose)

        input('\n' + '#'*12 + " Press ENTER to continue " + '#'*13 + '\n')

if test_case == 3: # Validation via simulation first, following with prototype validation.
    bt = serial.Serial(com_port, 9600, timeout=1)
    bt.write("32.3, 25, 15.5, 15.1, 27.9".encode()) # Refers to predicted [0, 150, 0, 0, 0, 0]
    input("\n Initial pose sent, press ENTER to start validation process. \n")
    for i in range(len(poses)):
        print('#'*20 + f' Pose #{i+1}  ' + '#'*20)
        
        target_pose = poses[i]
        simulation_pose, config = validate_pose(target_pose)

        bt_pose = ' '.join(str(f).replace('.', ',') for f in config)
        bt.write(bt_pose.encode())
        input('\n' + "Press ENTER when prototype reached the target pose!" + '\n')

        aruco_pose = get_pose_web(nuc_ip_adress)
        print(f"Camera validated pose: {aruco_pose}")
        print("Accuracy for aruco validation:")
        compare_poses(target_pose, aruco_pose)

        log_poses_to_csv(target_pose, simulation_pose, aruco_pose)
        input('\n' + '#'*12 + " Press ENTER to continue " + '#'*13 + '\n')

input('\n'+'#*'*25 + "\nYou can find recored poses in: Data/poses_log.csv\nValidation process complete, press ENTER to exit.")
