#include "FFT.h"


/*
    This was created in part with Chat GPT 4.0
*/

//Default debug statement I now love
#ifdef DEBUG
    #define DEBUG_PRINT(msg) std::cout << "DEBUG: " << msg << std::endl;
#else
    #define DEBUG_PRINT(msg)
#endif

    /*
        Respoinsible for performing Fast Fourier Transformation
        MUST be called after setup (Setup initally loads data)

        Start >> where the data has left off
        Inc >> The amount to increase / end
    
    */

    std::vector<FFT::Complex> FFT::audioData;

    /*
        I am not taking credit for this function - Mostly GPT's doing
        Based on Cooley Tukey Approach
    */
   std::vector<FFT::Complex> FFT::compute(int start, int inc) {
        DEBUG_PRINT("Beginning FFT\n");

        if (audioData.empty()) {
            DEBUG_PRINT("Is Empty!");
            return {}; // Early return for empty input
        }

        // Ensure the 'start' and 'inc' values are valid (ie to actually navigate through data)
        if (start < 0 || static_cast<size_t>(start) >= audioData.size() || inc <= 0) {
            DEBUG_PRINT("Invalid start or increment value");
            return {};
        }

        int end = std::min(start + inc, static_cast<int>(audioData.size())); //Accomodates left overs
        int n = end - start;

        // Slice the audioData to process only the segment from start to start+inc
        std::vector<Complex> segment(audioData.begin() + start, audioData.begin() + end);

        // bitReverseReorder(segment); // So this doesnt exist BUT WHYYYY doesnt it do what is expected 
        // tldr everything is broken but you know what rave party, every sound bar is wack

        // Iterative Cooley-Tukey FFT on the segment
        DEBUG_PRINT("Segment size: " << segment.size());

        //this all needs to be fix! 
        int m = 1;
        while (m < n) {
            Complex phaseShift = std::polar(1.0f, static_cast<float>(-2.0f * 3.1415f / m)); // Twiddle factor >> This is the phase shift for cosine and sine
            // printf("m = %d, phaseShift = (%f, %f)\n", m, phaseShift.real(), phaseShift.imag()); For printing if any weirdness. Verify valid vlaues from the above.

            // FFT computation for this segment
            for (int k = 0; k < n; k += m) { //Decides the waves to calculate, notice we skip more waves later (FFT)
                Complex w = 1;
                for (int j = 0; j < m / 2; j++) {
                    if (j < m) {
                        //We segment in order to get the seperate parts
                        Complex t = w * segment[k + j + m / 2]; //Butterfly operation (Seperates FFT from DFT)
                        Complex u = segment[k + j];
                        segment[k + j] = u + t;
                        segment[k + j + m / 2] = u - t;
                        w *= phaseShift;
                    }
                }
            }

            m *= 2;  // Double m at each stage (additional seperation from DFT)
        }
        
        

        DEBUG_PRINT("Complete computation");
        return segment;  // Return only the FFT result for this segment
    }


    /*
        This was originally the setup for FFT
        however due to the new architecture, this method is somewhat obselete
        
        
        Insertdata performs a similar action, however it overlaps the data to make it more gradual. 
    */
    void FFT::setup(std::vector<float>& input) {
        int n = input.size();
        if (n <= 1) {
            printf("Input size too small for FFT, returning early.\n");
            return;
        }
        
        
        audioData = realToComplex(input);  // Convert to complex
        DEBUG_PRINT("Converted to Complex");
    
       
    }

    /*
        While running the program, we dynamically grab samples to represent

        This method is fine on its own, but the additional computations for bitReverseReorder
        end up making the results skewed. It is best to fully flush the buffer when we reach a specific point

        TODO -- Fix data incorporation method
    */
    void FFT::insertData(const std::vector<float>& input) {
        // Remove the non-overlapping part
        size_t overlapSize = audioData.size() / 2;

        if (audioData.size() > overlapSize) {
            audioData.erase(audioData.begin(), audioData.begin() + (audioData.size() - overlapSize));
        }

        // Append new samples
        for (float sample : input) {
            audioData.emplace_back(sample, 0.0f);
        }

        // Keep size as power of 2 (for FFT later)
        size_t newSize = 1;
        while (newSize * 2 <= audioData.size()) {
            newSize *= 2;
        }
        audioData.resize(newSize);
    }


    // Convert real input to complex (imaginary part = 0)
    std::vector<FFT::Complex> FFT::realToComplex(const std::vector<float>& input) {
        std::vector<Complex> complexInput(input.size());
        for (size_t i = 0; i < input.size(); ++i) {
            complexInput[i] = Complex(input[i], 0.0f);
        }
        return complexInput;
    }

    /*
        This was also Produced via common programming aids, and was debugged thoroughly through testing

        This is best used with fresh data, and the current implementation could stand to benefit
        from a restructuring
    */
   void FFT::bitReverseReorder(std::vector<Complex>& data) {
        int n = data.size();
        int bits = 0;

        // Calculate the number of bits required
        while ((1 << bits) < n) bits++;

        int j = 0;
        for (int i = 0; i < n; i++) {
            if (i < j) {
                std::swap(data[i], data[j]);
            }

            // Reverse the bits of 'i' to get the bit-reversed index 'j'
            int mask = n >> 1;
            while (j >= mask && mask > 0) {
                j -= mask;
                mask >>= 1;
            }

            j += mask;
        }
    }

    

    // Return the next power of two for padding
    int FFT::nextPowerOfTwo(int n) {
        if (n == 0) return 1;
        return 1 << (int)std::ceil(std::log2(n));  //This is a more efficient method created from openAI
    }

    /*
        FFT (Cooley Tukey) Only works on powers of 2, so we pad it. This does skew results, but if fft is large enough it wont matter
        There are methods in which can work without powers of two, but we can very easily work with powers of two
        
        Since speed is a greater focus, we can lose accuracy

        This was coded using GPT, however the need came from testing. In hindsight, there are not as many applications
        where this is good
    */
    std::vector<float> FFT::padToPowerOfTwo(const std::vector<float>& input) {
        int n = input.size();
        int nextPow2 = nextPowerOfTwo(n);

        std::vector<float> paddedInput(nextPow2, 0.0f);
        std::copy(input.begin(), input.end(), paddedInput.begin());

        DEBUG_PRINT("Padding data to size: " << nextPow2);
        return paddedInput;
    }
