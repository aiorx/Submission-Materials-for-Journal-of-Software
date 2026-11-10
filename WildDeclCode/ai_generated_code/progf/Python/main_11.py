# Gerekli kütüphaneleri içe aktarın
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix
import csv
from tqdm import trange


def txt_file_save(message:str):
     with open('success_rates.txt', 'a') as f:
            f.write(message)


# Sinir ağı sınıfını tanımlayın
class neuralNetwork:

    # Sinir ağını başlatın
    def __init__(self, inputNodes, hiddenNodes, outputNodes, learningRate):
        # Giriş, gizli ve çıkış katmanındaki düğüm sayılarını belirleyin
        self.inodes = inputNodes
        self.hnodes = hiddenNodes
        self.onodes = outputNodes

        # Ağırlıkları ve bias'ları rastgele başlatın
        self.akj = np.random.uniform(size=self.inodes * self.hnodes, low=-1, high=1).reshape(self.hnodes, self.inodes)
        self.ajm = np.random.uniform(size=self.hnodes * self.onodes, low=-1, high=1).reshape(self.hnodes, self.onodes)
        self.bj = np.random.uniform(size=self.hnodes, low=-1, high=1).reshape(self.hnodes, 1)
        self.bm = np.random.uniform(size=self.onodes, low=-1, high=1).reshape(self.onodes, 1)

        # Öğrenme oranı
        self.lr = learningRate

        # Gerçek ve tahmin edilen değer listelerini başlatın
        self.actual_list = np.array([])
        self.predict_list = np.array([])
        
        txt_file_save(f"\n###############||Learning_Rate:{self.lr} || Hidden_Node:{self.hnodes}||###############|\n")

    # Aktivasyon fonksiyonu olarak sigmoid kullanın
    def activation_func(self, x):
        return 1 / (1 + np.exp(-x))

    # Sinir ağını eğitin
    def train(self, input_list, target_list):
        # Giriş listesini 2D dizisine dönüştürün
        inputs = np.array(input_list, ndmin=2).T
        B_ç = np.array(target_list, ndmin=2).T

        # Gizli katmana giriş sinyallerini hesaplayın
        Net_j = np.dot(self.akj, inputs) + self.bj
        Ç_j = self.activation_func(Net_j)

        # Çıkış katmanına giriş sinyallerini hesaplayın
        Net_m = np.transpose(np.dot(np.transpose(Ç_j), self.ajm)) + self.bm
        Ç_m = self.activation_func(Net_m)

        ### Geri yayılım ###
        E_m = B_ç - Ç_m

        delta_m = Ç_m * (1 - Ç_m) * E_m
        hidden_error = np.dot(self.ajm, delta_m)

        delta_Ajm = np.dot(Ç_j, self.lr * np.transpose(delta_m))
        self.ajm += delta_Ajm

        delta_Bm = self.lr * delta_m
        self.bm += delta_Bm

        delta_j = Ç_j * (1 - Ç_j) * hidden_error

        delta_Akj = np.dot(self.lr * delta_j, np.transpose(inputs))
        self.akj += delta_Akj

        delta_Bj = self.lr * delta_j
        self.bj += delta_Bj

    # Sinir ağını sorgulayın
    def query(self, input_list):
        # Giriş listesini 2D dizisine dönüştürün
        inputs = np.array(input_list, ndmin=2).T

        # Gizli katmana giriş sinyallerini hesaplayın
        Net_j = np.dot(self.akj, inputs) + self.bj
        Ç_j = self.activation_func(Net_j)

        # Çıkış katmanına giriş sinyallerini hesaplayın
        Net_m = np.transpose(np.dot(np.transpose(Ç_j), self.ajm)) + self.bm
        Ç_m = self.activation_func(Net_m)

        return Ç_m

    # Ağırlıkları ve bias'ları yazdırın
    def print_weight(self):
        print("akj:", self.akj)
        print("ajm:", self.ajm)
        print("bj:", self.bj)
        print("bm:", self.bm)


def save(fileName):
    # CSV dosyası oluşturun ve verileri yazın
    with open(fileName, 'w', newline='') as f:
        # Verileri sırayla dosyaya yazın
        writer = csv.writer(f)
        writer.writerow(['akj:'])
        np.savetxt(f, n.akj, delimiter=',')
        writer.writerow(['ajm:'])
        np.savetxt(f, n.ajm, delimiter=',')
        writer.writerow(['bj:'])
        np.savetxt(f, n.bj, delimiter=',')
        writer.writerow(['bm:'])
        np.savetxt(f, n.bm, delimiter=',')


def test(countt):
    # Sinir ağını test edin
    test_data_file = open("projectDatas/sign_mnist_test/sign_mnist_test.csv", 'r')
    test_data_list = test_data_file.readlines()
    test_data_file.close()
    count = 0

    for record in test_data_list:
        all_values = record.split(',')
        inputs = (np.asfarray(all_values[1:]) / 255.0 * 0.99) + 0.01
        B_ç = np.zeros(output_nodes) + 0.01
        B_ç[int(all_values[0])] = 0.99
        result = n.query(inputs)
        n.predict_list = np.append(n.predict_list, np.argmax(result))
        n.actual_list = np.append(n.actual_list, int(all_values[0]))

        #print("Cikti: %d, Beklenen: %d " % (np.argmax(result), int(all_values[0])))

        if np.argmax(result) == int(all_values[0]):
            count += 1

    if ((e%5 == 0) and e!=0):
        txt_file_save(f"{countt}.Basari orani: %f\n" % (count / len(test_data_list)))

# Sinir ağı parametrelerini başlatın
input_nodes = 784
hidden_nodes = 200
output_nodes = 25
learning_rate = 0.04

# Sinir ağı örneğini oluşturun
n = neuralNetwork(input_nodes, hidden_nodes, output_nodes, learning_rate)

# MNIST eğitim verilerini içe aktarın
training_data_file = open("projectDatas/sign_mnist_train/sign_mnist_train.csv", 'r')
training_data_list = training_data_file.readlines()
training_data_file.close()
# Sinir ağını eğitin
epochs = 10
for e in trange(epochs):
    for record in training_data_list:
        all_values = record.split(',')
        inputs = (np.asfarray(all_values[1:]) / 255.0 * 0.99) + 0.01
        B_ç = np.zeros(output_nodes) + 0.01
        B_ç[int(all_values[0])] = 0.99
        n.train(inputs, B_ç)
    
    if ((e%25 == 0) and e!=0):
        save(f"./weights/weight_bias_value_{e}.csv")
    
    test(e)


# Crafted with standard coding tools
def plot_confusion_matrix(x_expected, y_predicted, normalize=False, title=None, cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting normalize=True.
    """
    if not title:
        title = 'Confusion matrix'

    # Compute confusion matrix
    cm = confusion_matrix(x_expected, y_predicted)
    classes = np.unique(np.concatenate([x_expected, y_predicted]))

    if normalize:
        # Normalize the confusion matrix if specified
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)

    # Create a new figure and axis for plotting
    fig, ax = plt.subplots()
    
    # Display the confusion matrix as an image
    im = ax.imshow(cm, interpolation='nearest', cmap=cmap)
    ax.figure.colorbar(im, ax=ax)
    
    # Set axis labels and tick marks
    ax.set(xticks=np.arange(len(classes)),
           yticks=np.arange(len(classes)),
           xticklabels=classes, yticklabels=classes,
           title=title,
           ylabel='Expected Value',
           xlabel='Predicted Value')

    # Rotate the tick labels for better visibility
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")

    # Loop over data dimensions and create text annotations for each cell
    fmt = '.2f' if normalize else 'd'
    thresh = cm.max() / 2.
    for i in range(len(classes)):
        for j in range(len(classes)):
            ax.text(j, i, format(cm[i, j], fmt),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black")
            
            # Check if the prediction is correct, and if so, add a light green border
            # if i == j and cm[i, j] > 0:
            #     # Add a rectangle with a light green border around correctly predicted cells
            #     rect = plt.Rectangle((j - 0.5 + 0.05, i - 0.5 + 0.05), 0.9, 0.9, fill=False, alpha=1)
            #     ax.add_patch(rect)

    # Adjust layout for better appearance
    fig.tight_layout()
    
    # Return the figure and axis
    return fig, ax

# Example usage
x_expected = n.actual_list
y_predicted = n.predict_list

plot_confusion_matrix(x_expected, y_predicted, normalize=False)
plt.show()

test_data_file = open("projectDatas/sign_mnist_test/sign_mnist_test.csv", 'r')
test_data_list = test_data_file.readlines()
test_data_file.close()
# take the data from a record, rearrange it into a 28*28 array and plot it as an image
all_values = test_data_list[0].split(',')
image_array = np.asfarray(all_values[1:]).reshape((28,28))
plt.imshow(image_array, cmap='Greys', interpolation='None')
plt.show()
