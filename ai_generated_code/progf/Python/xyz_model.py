# Purpose:
# This program loads the xyz GCNN model and allows the user to make a prediction with it.
# It takes in either:
# - one csv file as an argument, which contains the coordinates of the atoms in a molecule.
# - or an xyz file directly from the QM9 Dataset.

# The xyz_model.keras must be located in the same directory as this script.

# Imports for the dependencies check and install
import importlib
import subprocess
import sys
import shutil

# The below code is refactored from the two project notebooks
# to process one csv or xyz file as a single dataset.
from pyscf import gto, scf
import os
from sklearn.preprocessing import OneHotEncoder
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.layers import Lambda
from tensorflow.keras.activations import relu
from tensorflow.keras.initializers import RandomUniform
from tensorflow.keras.layers import Lambda
from keras.config import enable_unsafe_deserialization
from keras.saving import register_keras_serializable

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# For verbose output
DEBUG = False

# REFERENCE: The block of code for checking dependencies below 
# has been Supported via standard programming aids, it has been refactored a little and commented.

# -- BEGIN AI GENERATED CODE -- #
# All required packages and their import paths
REQUIRED_PACKAGES = {
    'pyscf': 'pyscf.gto',
    'scikit-learn': 'sklearn.preprocessing',
    'numpy': 'numpy',
    'tensorflow': 'tensorflow',
    'pandas': 'pandas',
    'keras': 'keras.config',
}

# Function to check for missing packages and prompt for installation
def check_and_prompt_install():
    missing = []
    # Check for each requirement and add the unfound ones to missing list
    for pip_name, import_path in REQUIRED_PACKAGES.items():
        try:
            importlib.import_module(import_path)
        except ModuleNotFoundError:
            missing.append(pip_name)

    # If missing list is still empty, we are good to go
    if not missing:
        return

    print(f"\nMissing required packages: {', '.join(missing)}")

    # Check if pip is available
    if shutil.which("pip") is None:
        print("\nYou don't have `pip` available on this system.")
        print("Please install these packages manually using your system's package manager or install pip first:")
        sys.exit(1)

    # Offer to install missing packages
    choice = input("Would you like to install them now? [Y/N]: ").strip().lower()
    if choice == 'y':
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', *missing])
            print("\nPackages installed. Please re-run the script.")
            sys.exit(0)
        except subprocess.CalledProcessError:
            print("\npip failed to install some packages. Please try manually:")
            print(f"pip install {' '.join(missing)}")
            sys.exit(1)
    else:
        print("Installation aborted. Please install the packages manually and try again.")
        sys.exit(1)
# -- END AI GENERATED CODE -- #

# Function: Requests whether the user wants to debug/view in verbose mode
def check_for_debug():
    global DEBUG # Access the global var
    # Request their option
    debug_choice = input("Would you like to enable debug/verbose mode? [Y/N]: ").strip().lower()
    # Adjust based on choice, default is False, but doesn't hurt to be certain
    if debug_choice == 'y':
        DEBUG = True
        print("Debug mode enabled.")
    else:
        DEBUG = False
        print("Debug mode disabled.")

# Function: Calculate the energy gap
def homo_lumo_energy(atoms, coords):
    atom_str = '\n'.join(
        f"{atom},{x:.10f},{y:.10f},{z:.10f}"
        for atom, (x, y, z) in zip(atoms, coords)
    )
    if DEBUG: print(f"Atom String found:\n {atom_str}")
    mol = gto.Mole()
    mol.atom = atom_str
    mol.unit = 'Angstrom'
    mol.basis = 'sto-3g'
    mol.build()
    nelec = mol.nelectron
    # Fix spin: set spin = 0 for even nelec, 1 for odd (i.e., doublet)
    spin = 0 if nelec % 2 == 0 else 1
    # Now re-build with correct spin
    mol = gto.M(atom=atom_str, basis='sto-3g', unit='Angstrom', spin=spin)
    mf = scf.RHF(mol)
    mf.kernel()
    homo = mf.mo_energy[mf.mo_occ > 0][-1]
    lumo = mf.mo_energy[mf.mo_occ == 0][0]
    return lumo - homo

# Function: Gets and prints the energy gap
def get_energy_gap(atoms, coords):
    gap = homo_lumo_energy(atoms, coords)
    if DEBUG: print(f"Energy Gap calculated as: {gap:.6f}")
    return gap

# Function: Extracts the data from a single xyz file
def extract_xyz(file_path):
    with open(file_path, 'r') as infile:
        lines = infile.readlines()

    num_atoms = int(lines[0].strip())
    if DEBUG: print(f"Expecting {num_atoms} atoms.")
    atom_lines = lines[2:2 + num_atoms]
    atoms, coords = [], []

    for line in atom_lines:
        parts = line.split()
        atoms.append(parts[0])
        coords.append([float(v) for v in parts[1:4]])
    return atoms, np.array(coords)

# OneHotEncoder Setup
qm9_atoms = ['H', 'C', 'N', 'O', 'F']
feature_dim = len(qm9_atoms) + 3 # feature_dim = number of elements + spatial coordinates (x,y,z) i.e. (3)
encoder = OneHotEncoder(categories=[qm9_atoms], sparse_output=False, handle_unknown='ignore')
encoder.fit(np.array(qm9_atoms).reshape(-1, 1))

# Function: Parsing in the file
def parse_file(file_path):
  atoms, coords = [], []
  with open(file_path, 'r') as file:
    # Check if the file is in xyz format
    if file_path.endswith('.xyz'):
        atoms, coords = extract_xyz(file_path)
        if DEBUG: print(f"Parsed {len(atoms)} atoms and coordinates.")
        energy_gap = get_energy_gap(atoms, coords)
        if DEBUG: print(f"Energy gap: {energy_gap:.6f}")
    elif file_path.endswith('.csv'):
        atoms, coords = [], []
        with open(file_path, 'r') as f:
            for L in f:
                atom, x, y, z = L.strip().split(',')
                atoms.append(atom)
                coords.append([float(x), float(y), float(z)])
        energy_gap = get_energy_gap(atoms, coords)
  return atoms, np.array(coords), energy_gap

# Distance between atoms for determining if connected
def dense_adj(coords):
  if DEBUG: print("Calculating dense_adj")
  dists = np.linalg.norm(coords[:, None] - coords[None, :], axis=-1)
  adj = ((dists < 1.0) & (dists > 0)).astype(np.float32)
  return adj

# True distance between the atoms
def distance_mat(coords):
    if DEBUG: print("Calculating distance_mat")
    dists = np.linalg.norm(coords[:, None] - coords[None, :], axis=-1)
    return dists

# Define Real Bonds commenting has been omitted,
# refer to qm9_create_tfdataset.ipynb for a detailed explanation.
valencies = {'H': 1, 'C': 4, 'N': 3, 'O': 2, 'F': 1}
covalent_radii = {'H': 0.31, 'C': 0.76, 'N': 0.71, 'O':0.66, 'F' : 0.57}
def define_real_bonds(dense_adj, atoms):
    if DEBUG: print("Defining real bonds")
    real_bonds = np.zeros((len(dense_adj), len(dense_adj)))
    for i in range(len(atoms)):
        real_bonds[i][i] = valencies[atoms[i]] 
    for i in range(len(dense_adj)):
        candidate_bonds = list(enumerate(dense_adj[i]))
        candidate_bonds.pop(i)
        candidate_bonds.sort(key = lambda x:x[1])
        self_conv_radius = covalent_radii[atoms[i]]
        for bond in candidate_bonds: 
            if bond[1] <= self_conv_radius + covalent_radii[atoms[bond[0]]] + 0.05 and real_bonds[i][i] > 0 and real_bonds[bond[0]][bond[0]] > 0:
                real_bonds[i][bond[0]] = 1
                real_bonds[bond[0]][i] = 1
                real_bonds[i][i] -= 1
                real_bonds[bond[0]][bond[0]] -= 1
            else:
                continue
    return real_bonds

# Padding so all molecules form the same shape
def pad_array(arr, new_shape):
    if DEBUG: print("Padding array")
    p_val = 0.0
    padded = np.full(new_shape, p_val, dtype=arr.dtype)
    padded[:arr.shape[0], :arr.shape[1]] = arr
    return padded

# Use our encoder
def encode_labels(atoms, coords):
    if DEBUG: print("Enoding labels")
    # Reshaping the atoms into one per row for the encoder
    shaped_atoms = np.array(atoms).reshape(-1, 1)
    # Use our encoder on the atoms
    encoded_atoms = encoder.transform(shaped_atoms).astype(np.float32)
    # Add the coords to the encoded atoms
    return np.concatenate([encoded_atoms, coords], axis=-1)

# Create a mask for knowing what is actually connected
def create_mask(encoded_atoms, max_nodes):
    if DEBUG: print("Creating Mask")
    # Create a list of zeros with the size of max_nodes
    mask = np.zeros((max_nodes,), dtype=np.float32)
    # Set the first num_real elements to 1.0
    mask[:encoded_atoms.shape[0]] = 1.0
    return mask

# Prepares the data for processing into a TensorFlow Dataset later
def prepare_data(equ_dir):
    node_list, adj_list, mask_list, label_list, energy_gaps = [], [], [], [], []
    all_files = [] # Temp list to collect all files and labels

    # Iterate over both equ_dir and non_equ_dir folders
    # Collect the file paths and labels together
    all_files.append((equ_dir, -1))

    max_nodes = 26 # Max nodes found in any molecule
    temp_graphs = [] # Temp storage for the next loop

    # Go through each file-label pair and build a temp dataset
    for file_path, label in all_files:
        atoms, coords, energy_gap = parse_file(file_path)
        temp_graphs.append((atoms, coords, energy_gap, label))
        max_nodes = max(max_nodes, len(atoms))

    # Process each molecule
    for atoms, coords, energy_gap, label in temp_graphs:
        # Encoded the atoms and coords
        encoded_atoms = encode_labels(atoms, coords)

        # --- Components to Return (plus max_nodes) --- This order is important
        mask_list.append(create_mask(encoded_atoms, max_nodes))
        node_list.append(pad_array(encoded_atoms, (max_nodes, encoded_atoms.shape[1])))
        adj_list.append(pad_array(define_real_bonds(distance_mat(coords), atoms), (max_nodes, max_nodes)))
        label_list.append(np.array([label], dtype=np.float32))
        energy_gaps.append([energy_gap])

    return (
        np.array(node_list),
        np.array(adj_list),
        np.array(mask_list),
        np.array(label_list),
        max_nodes,
        np.array(energy_gaps, dtype=np.float32),
    )

# Creates our TensorFlow Dataset, this is typically exported for the training model
def create_tf_ds(molecules, adj_arr, mask_arr, labels, energy_gap, batch_size=32, shuffle=True, drop_remainder=False):
    # Reshape energy_gap to ensure it has shape [?, 1]
    energy_gap = energy_gap.reshape(-1, 1) # Convert to 2D array
    ds = tf.data.Dataset.from_tensor_slices(((molecules, adj_arr, mask_arr, energy_gap), labels))
    if shuffle:
        ds = ds.shuffle(buffer_size=len(molecules))
    # ds = ds.batch(batch_size, drop_remainder=drop_remainder)
    return ds

# --- These Layers are custom and need to be declared in this file --- #
# They are declared in the load_model method
def masked_avg_pooling(x, mask):
    mask = tf.expand_dims(mask, axis=-1) # -> (batch_size, num_nodes, 1)
    x_masked = x * mask # zero out masked nodes
    sum_x = tf.reduce_sum(x_masked, axis=1) # (batch_size, feature_dim)
    sum_mask = tf.reduce_sum(mask, axis=1) + 1e-7 # prevent division by zero
    return sum_x / sum_mask # (batch_size, feature_dim)

@register_keras_serializable()
class GCNNLayer(layers.Layer):
    # Constructor for the Graph Convolutional Neural Network Layer
    def __init__(self, output_size, **kwargs):
        super().__init__(**kwargs)
        self.output_size = output_size
        # Should be default values
        self.initializer = RandomUniform(minval=-0.05, maxval=0.05, seed=None)

    # Build creates the state of the layer (weights and bias)
    def build(self, input_shape):
        # num_features per node
        num_features = input_shape[0][-1]
        # This is our main weights matrix
        self.kernel = self.add_weight(shape=(num_features, self.output_size),initializer=self.initializer)
        # This is to add a bias to the output
        self.bias = self.add_weight(shape=(self.output_size,),initializer='zeros')
        # Build the layer by calling the parent class and this method
        super().build(input_shape)

    # Called every forward pass for the GraphConvLayer
    def call(self, inputs):
        # Extract the node features and adjacency matrix
        node_features, adjacency = inputs

        # Message passing via adjacency matrix
        # For each node, we multiply the adjacency matrix with the node features
        messages = tf.matmul(adjacency, node_features)

        # Apply the weights and bias then the activation function
        return relu(tf.matmul(messages, self.kernel) + self.bias)

# ------ MAIN ------ #
if __name__=='__main__':

   # Parse the arguments
    if len(sys.argv) != 2:
        print("Usage: python xyz-model.py <input_file.csv/xyz>")
        print("For further guidance, please refer to the Client Instructions PDF.")
        sys.exit(1)
    else:
        file_path = sys.argv[1]
        if DEBUG: print(f"Received file path: {file_path}")
    
    # Before we waste processing time, check if the file exists
    if not os.path.isfile(file_path):
        print(f"File: {file_path} was not found, please double check the path.")
        sys.exit(1)

    # Check for dependencies
    check_and_prompt_install() # Comment out this line to permanently disable the dependency check
    print("All dependencies found. Proceeding with inference.")

    # Set Debug state
    check_for_debug() # Comment out this line to permanently disable debug mode

    # Redirect stderr (XLA Service from the model prints a warning)
    log_file = open("tensorflow_logs.txt", "w")
    os.dup2(log_file.fileno(), sys.stderr.fileno())

    # REFERENCE: 
    # The block of code below has been Supported via standard programming aids to
    # load the model and replace the Lambda layer with a custom function.
    # -- BEGIN AI GENERATED CODE -- #
    try:
        enable_unsafe_deserialization()
        model = tf.keras.models.load_model(
            "xyz_model.keras",
            custom_objects={
                'GCNNLayer': GCNNLayer,
                'masked_avg_pooling': masked_avg_pooling
            }
        )
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)
    
    # Replace the masked_avg_pooling Lambda with a layer
    try:
        for layer in model.layers:
            if isinstance(layer, Lambda):
                layer.function = lambda args, fn=masked_avg_pooling: fn(args[0], args[1])
    except Exception as e:
        print(f"Error replacing Lambda layer: {e}")
        sys.exit(1)
    # -- END AI GENERATED CODE -- #

    # Preparing the data more or less the same as the notebook
    molecules, adj_arr, mask_arr, labels, max_nodes, energy_gaps = prepare_data(file_path)
    if DEBUG:
        print("Loaded", molecules.shape[0], "graphs, each padded to", max_nodes, "nodes")

    # Creating a dataset with one item
    qm9_03_test = create_tf_ds(molecules, adj_arr, mask_arr, labels, energy_gaps, shuffle=True)
    # Batch of one because we only have 1
    batch_size = 1
    test_ds = qm9_03_test.batch(batch_size, drop_remainder=True)

    if DEBUG:
        for (molecule, adj, mask, energy_gap), label in test_ds.take(1):
            print("molecule shape:", molecule.shape)
            print("adj shape:", adj.shape)
            print("mask shape:", mask.shape)
            print("energy_gap shape:", energy_gap.shape)
            print("label shape:", label.shape)

    # Make the prediction
    pred = model.predict(test_ds)

    # Extract the information from the prediction
    confidence = round(float(pred[0][0]) * 100, 1)
    message = "Predicted to be in equilibrium" if confidence > 50 else "Predicted to not be in equilibrium"
    prediction = True if confidence > 50 else False

    # Return stderr to normal
    sys.stderr.flush()
    log_file.close()
    sys.stderr = sys.__stderr__

    # Print our results
    print(f"------\nProcessed {file_path}\nResult: {prediction}\nProbability it is in Equilibrium: {confidence}%\n{message}\n------")