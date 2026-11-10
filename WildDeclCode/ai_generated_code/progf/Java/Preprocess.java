package de.uni_passau.fim.se2.sa.readability.utils;

import de.uni_passau.fim.se2.sa.readability.features.FeatureMetric;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

public class Preprocess {

    /**
     * A value of 3.6 splits the Scalabrino Dataset into almost evenly balanced binary classes.
     */
    public static final double TRUTH_THRESHOLD = 3.6;

    /**
     * Traverses through each java snippet in the specified source directory and computes the specified list of feature metrics.
     * Each snippet is then saved together with its extracted feature values and the truth score as one row in the csv, resulting
     * in the scheme [File,NumberLines,TokenEntropy,HalsteadVolume,Truth].
     * <p>
     * The File column value corresponds to the respective file name.
     * All feature values are rounded to two decimal places.
     * The truth value corresponds to a String that is set to the value "Y" if the mean rater score of a given snippet is greater or equal
     * than the TRUTH_THRESHOLD. Otherwise, if the mean score is lower than the TRUTH_THRESHOLD the truth value String is set to "N".
     *
     * @param sourceDir      the directory containing java snippet (.jsnp) files.
     * @param truth          the ground truth csv file containing the human readability ratings of the code snippets.                       `
     * @param csv            the builder for the csv.
     * @param featureMetrics the list of specified features via the cli.
     * @throws IOException if the source directory or the truth file does not exist.
     */
    public static void collectCSVBody(Path sourceDir, File truth, StringBuilder csv, List<FeatureMetric> featureMetrics) throws IOException {
        File directory = sourceDir.toFile();

        if (!directory.exists() || !directory.isDirectory()) {
            throw new IOException("Source directory does not exist or is not a directory.");
        }

        File[] files = directory.listFiles();
        if (files == null || files.length == 0) {
            throw new IOException("Source directory is empty.");
        }

        if (!truth.exists() || !truth.getName().endsWith(".csv")) {
            throw new IOException("Truth file does not exist or not csv file.");
        }
        String truthFileContent = Files.readString(Path.of(truth.toURI()));
        String[] meanScores = Arrays.stream((truthFileContent).split("\n"))
                .filter(line -> line.startsWith("Mean,"))
                .findFirst()
                .orElseThrow(() -> new IOException("Invalid truth file: Mean values are missing."))
                .replaceFirst("Mean,", "")
                .split(",");
        File[] snippetFiles = Arrays.stream(files).filter(file -> file.isFile() && file.getName().endsWith(".jsnp")).toArray(File[]::new);
        if (meanScores.length != snippetFiles.length) {
            throw new IOException("Invalid truth file: The number of entries does not match with the number of files in the source directory.");
        }

        // Sort files alphabetically by name
        Arrays.sort(snippetFiles, (f1, f2) -> {
            int num1 = extractLeadingNumber(f1.getName());
            int num2 = extractLeadingNumber(f2.getName());
            return Integer.compare(num1, num2);
        });

        for (int i = 0; i < snippetFiles.length; i++) {
            File snippetFile = snippetFiles[i];
            String fileName = snippetFile.getName();
            String codeSnippet = Files.readString(Path.of(snippetFile.toURI()));
            addCsvEntry(csv, fileName);

            for (FeatureMetric featureMetric : featureMetrics) {
                addCsvEntry(csv, featureMetric.computeMetric(codeSnippet));
            }

            String truthLabel = Double.parseDouble(meanScores[i]) >= TRUTH_THRESHOLD ? "Y" : "N";
            csv.append(truthLabel);
            if (i != files.length - 1) {
                csv.append("\n");
            }
        }
    }

    private static void addCsvEntry(StringBuilder csv, String newEntry) {
        String separator = ",";
        csv.append(newEntry);
        csv.append(separator);
    }

    private static void addCsvEntry(StringBuilder csv, double newEntry) {
        String separator = ",";
        csv.append(String.format("%.2f", newEntry));
        csv.append(separator);
    }

    // Below code Aided using common development resources
    // Please refer to preprocess.txt file
    public static int extractLeadingNumber(String filename) {
        try {
            String numberPart = filename.split("\\.")[0]; // assumes format like "123.jsnp"
            return Integer.parseInt(numberPart);
        } catch (Exception e) {
            return Integer.MAX_VALUE; // push non-numeric files to the end
        }
    }
}
