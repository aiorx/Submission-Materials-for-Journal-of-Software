package lab01;

import java.util.Random;

public class DNAGenerator_TestAICode {
	/*Prompt given to ChatGPT: 
	 * "Write code in Java to print to the console 1,000 randomly generated DNA 3 mers (e.g. “ACA”, “TCG” ) 
	 * where the frequency of the nucleotides are p(A) = 0.12, p(C) = 0.38, p(G) = 0.39 and p(T) = 0.11" 
	 * 
	 * The following code was Assisted with basic coding tools based on the prompt:
	 */
	
	// Function to generate a nucleotide based on given probabilities
    public static char generateNucleotide(Random rand) {
        double randomValue = rand.nextDouble();
        if (randomValue < 0.12) {
            return 'A';
        } else if (randomValue < 0.12 + 0.38) {
            return 'C';
        } else if (randomValue < 0.12 + 0.38 + 0.39) {
            return 'G';
        } else {
            return 'T';
        }
    }

    // Function to generate a random 3-mer
    public static String generate3Mer(Random rand) {
        StringBuilder threeMer = new StringBuilder(3);
        for (int i = 0; i < 3; i++) {
            threeMer.append(generateNucleotide(rand));
        }
        return threeMer.toString();
    }

    public static void main(String[] args) {
        Random rand = new Random();
        String sequence = "";
        for (int i = 0; i < 1000; i++) {
        	
        	/*
        	 * Editing code to assign generate3Mer(rand) to a variable
        	 * And add it to a main sequence to test conditions
        	 */
        	
            String codon = generate3Mer(rand);
            sequence = sequence + codon;
            System.out.println(codon);
        }
        
        /*
         * Testing conditions simply by printing out the following:
         * Calculating the total length of sequence the codons would form and 
         * the number of times a nucleotide occurs
         */
        
        double a_observed = sequence.chars().filter(ch -> ch == 'A').count();
        double c_observed = sequence.chars().filter(ch -> ch == 'C').count();
        double g_observed = sequence.chars().filter(ch -> ch == 'G').count();
        double t_observed = sequence.chars().filter(ch -> ch == 'T').count();
        
        System.out.println(sequence);
        System.out.println(a_observed);
        System.out.println(c_observed);
        System.out.println(g_observed);
        System.out.println(t_observed);
        System.out.println(sequence.length());
        
        /*
         * Another method of testing, as mentioned in Lab01:
         * Performing the chi-square test:
         * Null hypothesis, No: the distribution of A,C,G and T is 12%, 38%, 39% and 11% respectively
         * Alternate hypothesis, Na: the distribution is as claimed by No.
         */
        double a_expected = 360;
        double c_expected = 1140;
        double g_expected = 1170;
        double t_expected = 330;
        
        double dof = 3;
        double alpha = 0.05;
        
        double chisq = (Math.pow((a_observed-a_expected),2)/100) + 
        		(Math.pow((c_observed-c_expected),2)/100) +
        		(Math.pow((g_observed-g_expected),2)/100) +
        		(Math.pow((t_observed-t_expected),2)/100);
                
        double critical_value = 7.815;
        
        if (critical_value < chisq) {
        	System.out.println("Reject Ho, distribution differs from that described by Ho");
        } else {
        	System.out.println("Accept Ho, distribution is same as that described by Ho");
        }
        /*
         * The distribution of nucleotide does not align with the expected from the code produced by ChatGPT
         */
    }
}

