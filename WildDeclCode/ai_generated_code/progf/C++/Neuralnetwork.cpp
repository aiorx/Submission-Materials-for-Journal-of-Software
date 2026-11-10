//built-in libraries
#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdlib>
#include <stdexcept>
#include <fstream>
#include <cmath>
#include <random>
//own headerfiles
#include "../include/Matrix.h"
#include "../include/NeuralNetwork.h"

NeuralNetwork::NeuralNetwork(const std::vector<int> layer_sizes, const double l_r, const std::vector<std::string> output, const std::string t, const std::vector<int> act_funct) : 
    layers(layer_sizes.size()-1),
    size(layer_sizes),
    activation_function(act_funct),
    weights(layer_sizes.size() - 1), 
    biases(layer_sizes.size() - 1), 
    learning_rate(l_r), 
    output_values(output),
    title(t) {

    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(-1.0, 1.0);

    for (int i = 0; i < layers; i++) {
        weights[i] = Matrix(layer_sizes[i+1],layer_sizes[i]);
        weights[i].randomize();
        biases[i] = std::vector<double>(layer_sizes[i+1]);
        for (int j = 0; j < layer_sizes[i+1]; j++) {
            biases[i][j] = dis(gen); //assign a random value to weights and biases
        }
    }
}

NeuralNetwork::NeuralNetwork(const std::string& filename){ //in case of importing net from file
    std::ifstream file(filename);
    if (!file.is_open()) { //handle error
        throw std::runtime_error("Failed to open file for reading: " + filename);
    }

    //title
    std::string line;
    if (std::getline(file, line)) title = line; // the program will write out the title after finishing import
    //size
    if (std::getline(file, line)) {
        std::stringstream ss(line);
        int num;
        while (ss >> num) {
            size.push_back(num);
        }
    }
    //layers int
    layers = size.size()-1;
    //allocate matrices and biases
    weights.resize(layers); 
    biases.resize(layers);
    for (int i = 0; i < layers; i++) {
        weights[i] = Matrix(size[i+1],size[i]);
        biases[i] = std::vector<double>(size[i+1]);
    }
    //learning rate
    if (std::getline(file, line)) learning_rate = std::stod(line);
    //output values
    if (std::getline(file, line)) {
        std::stringstream ss(line);
        std::string output;
        while (ss >> output) {
            output_values.push_back(output);
        }
    }
    //activation functions
    if (std::getline(file, line)) {
        std::stringstream ss(line);
        int num;
        while (ss >> num) {
            activation_function.push_back(num);
        }
    }
    //weights
    for(int mi = 0; mi < layers; mi++){
        for(int rows = 0; rows < size[mi + 1];rows++){
            std::string line;
            if (std::getline(file, line)) {
                std::stringstream ss(line);
                double num;
                for(int cols = 0; cols < size[mi];cols++){
                    ss >> num;
                    weights[mi].data[rows][cols] = num;
                }
            }
        }
    }

    //biases
    for(int mi = 0; mi < layers; mi++){
        std::string line;
        if (std::getline(file, line)) {
            std::stringstream ss(line);
            double num;
            for(int i = 0; i < size[mi + 1];i++){
                ss >> num;
                biases[mi][i] = num;
            }
        }
    }
    file.close();
}

double NeuralNetwork::sigmoid(const double x) const {
    return 1.0 / (1.0 + std::exp(-x));
}
double NeuralNetwork::sigmoid_derivative(const double x) const {
        double sig = sigmoid(x);
        return sig * (1.0 - sig);
}

double NeuralNetwork::relu(const double x) const {
    return x > 0 ? x : 0;
}
double NeuralNetwork::relu_derivative(const double x) const {
    return x > 0 ? 1 : 0;
}

double NeuralNetwork::runActivationFunction(const int index, const double value) const{
    return (activation_function[index] == SIGMOID)? sigmoid(value):relu(value);
}
double NeuralNetwork::runActivationFunctionDerivative(const int index, const double value) const{
    return (activation_function[index] == SIGMOID)? sigmoid_derivative(value):relu_derivative(value);
}

int NeuralNetwork::run(const std::vector<double>& input) const {
    if(input.size() != static_cast<size_t>(size[0])) //handle invalid input
        throw std::invalid_argument("Input size invalid");


    std::vector<double> activation = input; //copy input values


    //forward propagation (this is where the magic happens)
    for(int i = 0; i < layers;i++)
    {
        activation = weights[i].vector_multiply(activation);
        for(int o = 0; o < static_cast<int>(activation.size());o++)
        {
            activation[o] += biases[i][o];
            activation[o] = runActivationFunction(i,activation[o]);
        }
    }
    //for(double x:activation) std::cout << x << ' ';
    //std::cout << '\n';
    //find max value, return index
    int max = 0;
    double max_v = activation[0];
    for(int o = 0; o < static_cast<int>(activation.size());o++)
    {
        if(activation[o] > max_v){
            max = o;
            max_v = activation[o];
        }
    }
    //std::cout << activation[0] << '\t' << activation[1] << '\t' << activation[2] << '\n'<< activation[3] << '\t'<< activation[4] << '\t'<< activation[5] << '\t'<< activation[6] << '\t';
    //std::cout << max << '\t' << max_v << '\n';
    return max;
}

void NeuralNetwork::learn(const std::vector<double> &input, const std::vector<double> &expected_output){
    if(input.size() != static_cast<size_t>(size[0])) //handle invalid input
        throw std::invalid_argument("Input size invalid");
    if(expected_output.size() != static_cast<size_t>(size[layers]))
        throw std::invalid_argument("Output size invalid");

    //do basically the same thing as in forward propagation but save the data
    std::vector<double> activation = input; //copy input values
   
    std::vector<std::vector<double>> z(layers); 
    std::vector<std::vector<double>> a(layers+1);//include input

    a[0] = activation;

    for(int l = 0; l < layers;l++)
    {
        activation = weights[l].vector_multiply(activation);
        for(int o = 0; o < static_cast<int>(activation.size());o++)
        {
            activation[o] += biases[l][o];
        }
        z[l] = activation;
        for(int o = 0; o < static_cast<int>(activation.size());o++)
        {
            activation[o] = runActivationFunction(l,activation[o]);
        }
        a[l+1] = activation;
    }

    //calculate error for the last layer
    const int last = layers-1;
    std::vector<std::vector<double>> error(layers);
    error[last] = std::vector<double>(size[layers]);

    for (int i = 0; i < size[layers]; i++) {
        error[last][i] = (activation[i]-expected_output[i])* runActivationFunctionDerivative(last,z[last][i]);
    }

    //calculate all error
    
    for(int l = last-1; l >= 0;l--){
        error[l] = std::vector<double>(size[l+1]);
        std::vector<double> temp = weights[l+1].transpose().vector_multiply(error[l+1]);
        for(int j = 0; j < size[l+1];j++)
        {
            error[l][j] = temp[j]*runActivationFunctionDerivative(l,z[l][j]);
        }
    }

    //change weights and biases
    
    for (int l = 0; l < layers; l++) {
        for (int j = 0; j < size[l+1]; j++) {
            biases[l][j] -= learning_rate * error[l][j];
            //do weights
            for(int k = 0; k < size[l];k++){
                weights[l].data[j][k] -= learning_rate * a[l][k] * error[l][j];
            }
        }
    }
}


void NeuralNetwork::print_weights_and_biases() const { 
    //this code is Penned via standard programming aids. it works. don't touch it
    //it's used mainly for debugging anyway

    std::cout << "Weights and Biases of the Network:" << std::endl;

    // Iterate over each layer of the network
    for (int layer = 0; layer < layers; ++layer) {
        std::cout << "Layer " << layer + 1 << " weights and biases:" << std::endl;

        // Print the weights for the current layer
        std::cout << "Weights:" << std::endl;
        for (size_t i = 0; i < weights[layer].data.size(); ++i) {
            for (size_t j = 0; j < weights[layer].data[i].size(); ++j) {
                std::cout << weights[layer].data[i][j] << " ";
            }
            std::cout << std::endl;
        }

        // Print the biases for the current layer
        std::cout << "Biases:" << std::endl;
        for (size_t i = 0; i < biases[layer].size(); ++i) {
            std::cout << biases[layer][i] << " ";
        }
        std::cout << std::endl;
    }
}

void NeuralNetwork::export_network(const std::string& filename) const {
    std::ofstream file(filename);
    if (!file.is_open()) { //handle error
        throw std::runtime_error("Failed to open file for writing: " + filename);
    }

    //title
    file << title << '\n'; //to follow files
    //size
    for(int x: size)
        file << x << ' ';
    file << '\n';
    //learning rate
    file << learning_rate << '\n';
    //output values
    for(std::string x: output_values)
        file << x << ' ';
    file << '\n';
    //activation functions
    for(int x: activation_function)
        file << x << ' ';
    file << '\n';
    //weights
    for(Matrix m: weights)
    {
        for(std::vector<double> m1: m.data)
        //there is no need to make a difference between the data types
        //and matrices because that can be calculated with size
        {
            for(double w: m1)
                file << w << ' '; //this will be real pain in the ass to figure out
            file << '\n';
        }
    }
    //biases
    for(std::vector<double> b: biases)
    {
        for(double x: b)
            file << x << ' ';
        file << '\n';
    }

    std::cout << "Network saved successfully";

    /* This is chatgpts code. I don't like it. I dont like file management. I hate this shit.
    the main problem with this is that it separates everything to different lines
    it's hard to write an importing algorithm for it, and I like to work with my own mess
    if it's shit, it should be my work

    I will leave this here to remind myself I'm a terrible programmer
    
    // Save size
    file << size.size() << "\n"; // Number of layers
    for (int s : size) file << s << " ";
    file << "\n";

    // Save learning rate
    file << learning_rate << "\n";

    // Save output values
    file << output_values.size() << "\n";
    for (const std::string& s : output_values) file << s << "\n";

    // Save weights
    file << weights.size() << "\n"; // Number of weight matrices
    for (const Matrix& w : weights) {
        file << w.getRows() << " " << w.getCols() << "\n";
        for (const auto& row : w.data) {
            for (double val : row) file << val << " ";
            file << "\n";
        }
    }
    // Save biases
    file << biases.size() << "\n"; // Number of bias vectors
    for (const auto& b : biases) {
        file << b.size() << "\n";
        for (double val : b) file << val << " ";
        file << "\n";
    }
    */
    file.close();
}