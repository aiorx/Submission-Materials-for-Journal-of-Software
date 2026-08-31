# debug file for project.ipynb

from ultralytics import YOLO
# import cv2
import numpy as np
# from PIL import Image
import torch
import torch.nn as nn
from torch.utils.data import random_split, DataLoader, Subset
from torchvision import datasets, transforms
import optuna
from sklearn.metrics import f1_score, confusion_matrix

model = YOLO('yolov8n-pose.pt')

# `feature_extractor` is the part of the model suitable for feature extraction

class YOLO_kp_Classifier(nn.Module):
    def __init__(self, num_keypoints, num_classes=3):
        super(YOLO_kp_Classifier, self).__init__()
        # to flatten the output 
        #self.flatten = nn.Flatten()
        # add new classification layer(s) to the model
        self.classifier = nn.Sequential(
            nn.Linear(num_keypoints*2, 512),  # 17 keypoints * 2 (x, y coordinates for each keypoint)
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes),
        )
    
    def forward(self, keypoints_2d):
        #keypoints_2d = self.flatten(keypoints_2d)
        output = self.classifier(keypoints_2d)
        return output
    
def get_keypoints_from_yolo(model, inputs):
    #model.eval()  # YOLO model set to evaluation mode because we are not training it
    with torch.no_grad(): # gradients are not computed for the frozen model
        results = model(inputs)
        keypoints = results[0].keypoints.data  # extract the keypoints from the results
    return keypoints[:, :, :2]  # remove the 3rd dimension (confidence scores)

def process_keypoints_for_classifier(keypoints):
    # processing the keypoints in a suitable format for the classifier
    # keypoints is of shape [batch_size, 17, 3]
    # normalizing keypoints across the keypoints dimension
    # with min-max normalization i
    kp_tensor_norm = (keypoints - keypoints.min(dim=1, keepdim=True)[0]) / (keypoints.max(dim=1, keepdim=True)[0] - keypoints.min(dim=1, keepdim=True)[0])
    
    # Flatten the last two dimensions while keeping the batch dimension
    batch_flattened = kp_tensor_norm.view(keypoints.size(0), -1)  # Reshapes to [batch_size, 17*2]
    return batch_flattened


def train_and_eval_model(kp_classifier_model, model, optimizer, num_epochs, train_loader, val_loader, device):
    
    kp_classifier_model = kp_classifier_model.to(device)  # move model to device
    kp_classifier_model.train()  # set model to training mode
    
    print("type of train_loader", type(train_loader))

    for epoch in range(num_epochs):
        for batch in train_loader:
            # access images and labels
            inputs = batch[0].to(device)
            labels = batch[1].to(device)
            #print("inputs", type(inputs), len(inputs), inputs)
            #inputs, labels = inputs.to(device), labels.to(device)  # move data to device
            model = model.to(device) # YOLO move model to device
            optimizer.zero_grad()  # Zero the parameter gradients
            keypoints = get_keypoints_from_yolo(model, inputs) # get keypoints from the YOLO model
            processed_kps = process_keypoints_for_classifier(keypoints) # prepare the keypoints for the classifier
            #print("processed_kps type: {} , len: {}, kpts:{}".format(type(processed_kps), len(processed_kps[0]), processed_kps))
            classification_output = kp_classifier_model(processed_kps) # get results for the classification 
            loss = criterion(classification_output , labels)  # Compute loss
            loss.backward()  # Backpropagate the loss
            optimizer.step()  # Update weights

            # todo: further processing, such as calculating accuracy or loss, goes here

        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')
            
        
        kp_classifier_model.eval()  # model to evaluation mode

        total_loss = 0
        all_predictions = []
        all_labels = []

        with torch.no_grad():  # no need to compute gradients, because we are in evaluation mode
            for inputs, labels in val_loader:  # iterate over validation dataset
                inputs, labels = inputs.to(device), labels.to(device)  # move data to device
                keypoints = get_keypoints_from_yolo(model, inputs) # get keypoints from the YOLO model
                processed_kps = process_keypoints_for_classifier(keypoints) # prepare the keypoints for the classifier
                classification_output = kp_classifier_model(processed_kps) # get results for the classification 
                loss = criterion(classification_output , labels)  # compute loss
                total_loss += loss.item()  # accumulate the loss
                # get predictions for output
                _, predicted = torch.max(classification_output.data, 1)
                # collect the predictions and labels
                all_predictions.extend(predicted.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
            # calculate the validation metrics:
            avg_loss = total_loss / len(val_loader)  # get the average loss
            accuracy = (np.array(all_predictions) == np.array(all_labels)).mean()
            f1 = f1_score(all_labels, all_predictions, average='weighted')  
            conf_matrix = confusion_matrix(all_labels, all_predictions)
            
            print(f"Validation Loss: {avg_loss:.4f}")
            print(f"Validation Accuracy: {accuracy:.4f}")
            print(f"Validation F1 Score: {f1:.4f}")
            print("Confusion Matrix:")
            print(conf_matrix)
            
            # here: F1 score chosen as the metric to optimize
            # other options: - combining metrics like accuracy and F1 score to maximize on both
            #                        - or multi-objective optimization on F1 score and accuracy
    return f1 

# this function was Produced via common programming aids-4

def get_k_fold_indices(n, k=5, random_seed=None):
    """
    Generate indices for k-fold cross-validation.

    Parameters:
    - n: Total number of samples in the dataset.
    - k: Number of folds.
    - random_seed: Optional seed for reproducibility.

    Returns:
    - A list of tuples, each containing (train_indices, val_indices) for a fold.
    """
    # Initialize the random generator
    g = torch.Generator()
    if random_seed is not None:
        g.manual_seed(random_seed)
    
    # Generate a random permutation of indices
    indices = torch.randperm(n, generator=g).tolist()
    
    # Calculate fold sizes
    fold_sizes = [n // k for _ in range(k)]
    for i in range(n % k):
        fold_sizes[i] += 1
    
    # Generate train and validation indices for each fold
    current = 0
    folds_indices = []
    for fold_size in fold_sizes:
        start, end = current, current + fold_size
        val_indices = indices[start:end]
        train_indices = indices[:start] + indices[end:]
        folds_indices.append((train_indices, val_indices))
        current = end
    
    return folds_indices

def objective(trial):
    # Define hyperparameters to optimize
    lr = trial.suggest_categorical("lr", [1e-4]) #, 5e-4, 1e-3])
    #momentum = trial.suggest_categorical("momentum", [0.9, 0.95])
    batch_size = trial.suggest_categorical("batch_size", [1])# 4, 8, 16]) # other batch sizes than 1 give an error unfortunately
    num_epochs = trial.suggest_categorical("num_epochs", [20]) #100, 200, 300])

    # convert dataset into a list for index-based access
    dataset = train_and_val_dataset

    validation_scores = []

    n = len(dataset)
    k = 5
    folds_indices = get_k_fold_indices(n, k, random_seed=13)

    for fold, (train_idx, val_idx) in enumerate(folds_indices, start=1):
        train_subset = Subset(dataset, train_idx)
        val_subset = Subset(dataset, val_idx)
        print("type of train subset: " , type(train_subset))
        train_loader = DataLoader(train_subset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_subset, batch_size=batch_size, shuffle=False)
        print("type of train loader: " , type(train_loader))
        # initializing the model and optimizer with the chosen hyperparameters
        kp_classifier_model = YOLO_kp_Classifier(num_keypoints=num_keypoints, num_classes=num_classes)
        optimizer = torch.optim.Adam(kp_classifier_model.classifier.parameters(), lr=lr, weight_decay=1e-5)
    
        # training and evaluating the model
        validation_score = train_and_eval_model(kp_classifier_model, model, optimizer, num_epochs, train_loader, val_loader, device)
        validation_scores.append(validation_score)

    return np.mean(validation_scores)

if __name__ == "__main__":

    num_classes = 3  #  3-class classification problem
    num_keypoints = 17  # 17 keypoints in the model

    kp_classifier_model = YOLO_kp_Classifier(num_keypoints=num_keypoints, num_classes=num_classes)

    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)), # Resize images for the model?
        transforms.ToTensor()
        #transforms.Normalize(), # todo: add a normalization step!
    ])

    data_path = 'learning_from_images/src/example_images'
    own_dataset = datasets.ImageFolder(root=data_path, transform=data_transforms)

    generator1 = torch.Generator().manual_seed(13)  # set seed for reproducibility of the split
    train_and_val_dataset, test_dataset =random_split(own_dataset, [0.8, 0.2], generator=generator1)  # 80% training and evaluation, 20% testing

    criterion = nn.CrossEntropyLoss()

    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu") # else ("mps" if torch.backends.mps.is_available())
    print(f"Using device: {device}")


    study = optuna.create_study(direction='maximize')
    study.optimize(objective, n_trials=5)  # run 20 trials

    # Best hyperparameters
    print("Best hyperparameters:", study.best_params)