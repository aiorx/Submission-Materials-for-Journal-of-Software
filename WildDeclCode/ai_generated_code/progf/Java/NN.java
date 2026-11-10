import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

public class NN {
    public static void main(String[] args) throws Exception {
        //Load and normalize the dataset
        String filePath = "both-combined_slice4.csv";
        List<double[]> data = loadCSV(filePath);
        List<double[]> normalizedData = normalize(data);
        int numFeatures = normalizedData.get(0).length - 1;

        int trainSize = (int) (normalizedData.size() * 0.8);
        List<double[]> trainData = normalizedData.subList(0, trainSize);
        List<double[]> testData = normalizedData.subList(trainSize, normalizedData.size());

        int hiddenLayerSize = (numFeatures + 1) / 2; 
        double learningRate = 0.3;
        double momentum = 0.2;
        int epochs = 500;
        NeuralNetwork nn = new NeuralNetwork(numFeatures, hiddenLayerSize, 1, learningRate, momentum);

        List<Double> epochLosses = new ArrayList<>();
        for (int epoch = 1; epoch <= epochs; epoch++) {
            double loss = 0.0;
            for (double[] row : trainData) {
                double[] inputs = new double[numFeatures];
                System.arraycopy(row, 0, inputs, 0, numFeatures);
                double label = row[numFeatures];
                loss += nn.train(inputs, label, epoch);
            }
            epochLosses.add(loss / trainData.size());
            if (epoch % 50 == 0) {
                System.out.printf("Epoch %d: Loss = %.4f\n", epoch, loss / trainData.size());
            }
        }

        int correct = 0;
        int[][] confusionMatrix = new int[2][2];
        for (double[] row : testData) {
            double[] inputs = new double[numFeatures];
            System.arraycopy(row, 0, inputs, 0, numFeatures);
            double label = row[numFeatures];
            double prediction = nn.predict(inputs);
            int predictedClass = (prediction >= 0.5) ? 1 : 0;
            int actualClass = (int) label;

            //Update confusion matrix
            confusionMatrix[actualClass][predictedClass]++;
            if (predictedClass == actualClass) {
                correct++;
            }
        }

        double accuracy = (double) correct / testData.size();
        double precision = (double) confusionMatrix[1][1] / (confusionMatrix[1][1] + confusionMatrix[0][1]);
        double recall = (double) confusionMatrix[1][1] / (confusionMatrix[1][1] + confusionMatrix[1][0]);
        double f1Score = 2 * precision * recall / (precision + recall);

        System.out.println("\n=== Evaluation Results ===");
        System.out.printf("Accuracy: %.4f\n", accuracy);
        System.out.printf("Precision: %.4f\n", precision);
        System.out.printf("Recall: %.4f\n", recall);
        System.out.printf("F1-Score: %.4f\n", f1Score);
        System.out.println("\nConfusion Matrix:");
        System.out.printf("\tPredicted: 0\tPredicted: 1\n");
        System.out.printf("Actual: 0\t%d\t\t%d\n", confusionMatrix[0][0], confusionMatrix[0][1]);
        System.out.printf("Actual: 1\t%d\t\t%d\n", confusionMatrix[1][0], confusionMatrix[1][1]);

        System.out.println("\nLoss Trend (First 10 epochs and last 10 epochs):");
        for (int i = 0; i < Math.min(10, epochLosses.size()); i++) {
            System.out.printf("Epoch %d: Loss = %.4f\n", i + 1, epochLosses.get(i));
        }
        for (int i = Math.max(epochLosses.size() - 10, 0); i < epochLosses.size(); i++) {
            System.out.printf("Epoch %d: Loss = %.4f\n", i + 1, epochLosses.get(i));
        }
    }

    private static List<double[]> loadCSV(String filePath) throws Exception {
        BufferedReader br = new BufferedReader(new FileReader(filePath));
        List<double[]> data = new ArrayList<>();
        String line;

        br.readLine();

        while ((line = br.readLine()) != null) {
            String[] values = line.split(",");
            double[] row = new double[values.length];
            for (int i = 0; i < values.length; i++) {
                row[i] = i == values.length - 1 ? (values[i].equals("tooth_brush") ? 1.0 : 0.0) : Double.parseDouble(values[i]);
            }
            data.add(row);
        }
        br.close();
        return data;
    }

    private static List<double[]> normalize(List<double[]> data) {
        int numFeatures = data.get(0).length - 1; // Exclude label
        double[] min = new double[numFeatures];
        double[] max = new double[numFeatures];

        for (int i = 0; i < numFeatures; i++) {
            min[i] = Double.MAX_VALUE;
            max[i] = Double.MIN_VALUE;
        }

        for (double[] row : data) {
            for (int i = 0; i < numFeatures; i++) {
                if (row[i] < min[i]) min[i] = row[i];
                if (row[i] > max[i]) max[i] = row[i];
            }
        }

        List<double[]> normalizedData = new ArrayList<>();
        for (double[] row : data) {
            double[] normalizedRow = new double[row.length];
            for (int i = 0; i < numFeatures; i++) {
                normalizedRow[i] = (row[i] - min[i]) / (max[i] - min[i]);
            }
            normalizedRow[numFeatures] = row[numFeatures]; 
            normalizedData.add(normalizedRow);
        }

        return normalizedData;
    }
}



// Neural Network class - Aided using common development resources
class NeuralNetwork {
    private final int inputSize;
    private final int hiddenSize;
    private final int outputSize;
    private final double learningRate;
    private final double momentum;
    private final double[] hiddenLayer;
    private final double[] outputLayer;
    private final double[][] weightsInputHidden;
    private final double[][] weightsHiddenOutput;
    private final double[] biasHidden;
    private final double[] biasOutput;
    private final double[][] prevWeightsInputHidden;
    private final double[][] prevWeightsHiddenOutput;

    public NeuralNetwork(int inputSize, int hiddenSize, int outputSize, double learningRate, double momentum) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.learningRate = learningRate;
        this.momentum = momentum;

        this.hiddenLayer = new double[hiddenSize];
        this.outputLayer = new double[outputSize];
        this.weightsInputHidden = new double[inputSize][hiddenSize];
        this.weightsHiddenOutput = new double[hiddenSize][outputSize];
        this.biasHidden = new double[hiddenSize];
        this.biasOutput = new double[outputSize];
        this.prevWeightsInputHidden = new double[inputSize][hiddenSize];
        this.prevWeightsHiddenOutput = new double[hiddenSize][outputSize];
        initializeWeights();
    }

    private void initializeWeights() {
        for (int i = 0; i < inputSize; i++) {
            for (int j = 0; j < hiddenSize; j++) {
                weightsInputHidden[i][j] = Math.random() - 0.5;
            }
        }
        for (int i = 0; i < hiddenSize; i++) {
            for (int j = 0; j < outputSize; j++) {
                weightsHiddenOutput[i][j] = Math.random() - 0.5;
            }
            biasHidden[i] = Math.random() - 0.5;
        }
        for (int i = 0; i < outputSize; i++) {
            biasOutput[i] = Math.random() - 0.5;
        }
    }

    public double train(double[] inputs, double target, int epoch) {
        // Adjust learning rate dynamically
        double currentLearningRate = learningRate / (1 + 0.001 * epoch);

        // Forward pass
        forward(inputs);

        // Compute loss (Mean Squared Error)
        double loss = 0.5 * Math.pow(outputLayer[0] - target, 2);

        // Backpropagation
        double[] outputError = new double[outputSize];
        for (int i = 0; i < outputSize; i++) {
            outputError[i] = outputLayer[i] - target;
        }

        double[] hiddenError = new double[hiddenSize];
        for (int i = 0; i < hiddenSize; i++) {
            for (int j = 0; j < outputSize; j++) {
                hiddenError[i] += outputError[j] * weightsHiddenOutput[i][j];
            }
            hiddenError[i] *= hiddenLayer[i] * (1 - hiddenLayer[i]);
        }

        // Update weights and biases with momentum
        for (int i = 0; i < hiddenSize; i++) {
            for (int j = 0; j < outputSize; j++) {
                double delta = currentLearningRate * outputError[j] * hiddenLayer[i];
                weightsHiddenOutput[i][j] -= delta + momentum * prevWeightsHiddenOutput[i][j];
                prevWeightsHiddenOutput[i][j] = delta;
                biasOutput[j] -= currentLearningRate * outputError[j];
            }
        }

        for (int i = 0; i < inputSize; i++) {
            for (int j = 0; j < hiddenSize; j++) {
                double delta = currentLearningRate * hiddenError[j] * inputs[i];
                weightsInputHidden[i][j] -= delta + momentum * prevWeightsInputHidden[i][j];
                prevWeightsInputHidden[i][j] = delta;
                biasHidden[j] -= currentLearningRate * hiddenError[j];
            }
        }

        return loss;
    }

    public double predict(double[] inputs) {
        forward(inputs);
        return outputLayer[0];
    }

    private void forward(double[] inputs) {
        for (int i = 0; i < hiddenSize; i++) {
            hiddenLayer[i] = 0;
            for (int j = 0; j < inputSize; j++) {
                hiddenLayer[i] += inputs[j] * weightsInputHidden[j][i];
            }
            hiddenLayer[i] += biasHidden[i];
            hiddenLayer[i] = sigmoid(hiddenLayer[i]);
        }

        for (int i = 0; i < outputSize; i++) {
            outputLayer[i] = 0;
            for (int j = 0; j < hiddenSize; j++) {
                outputLayer[i] += hiddenLayer[j] * weightsHiddenOutput[j][i];
            }
            outputLayer[i] += biasOutput[i];
            outputLayer[i] = sigmoid(outputLayer[i]);
        }
    }

    private double sigmoid(double x) {
        return 1 / (1 + Math.exp(-x));
    }
}
