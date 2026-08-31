/*********************************************************************************************************************\
 * Lauren White - Project 3
 * Huffman Encoder and Decoder
 * 
 * This program allows the user to enter a string, then:
 * - Computes character frequencies.
 * - Builds a Huffman Tree using a manual priority queue.
 * - Generates Huffman codes for efficient encoding.
 * - Encodes the user-provided string using Huffman compression.
 * - Decodes the encoded message to retrieve the original string.
\*********************************************************************************************************************/
//Header Drafted using common GitHub development resources

#include "BinaryTree.h"
#include "PriorityQueue.h"
#include <iostream>

using namespace std;

int main() 
{
    string s;
    int freq[256] = { 0 };
    PriorityQueue pq;
    BinaryTree huffmanTree;
    string encodedMessage = "";
    string decodedMessage;

    cout << "Enter a string to be encoded: ";
    getline(cin, s);

    //For each character in the string, increment the count
    for (char c : s) 
    {
        freq[c]++;
    }

    //Create a priority queue and add each character as a node
    for (int index = 0; index < 256; index++)
    {
        //If the frequency is greater than 0
        if (freq[index] > 0) 
        {
            //Add a new node and its frequency
            Node* node = new Node(index);
            node->frequency = freq[index];
            pq.push(node);
        }
    }

    //Build the Huffman tree and the Huffman codes
    huffmanTree.buildTree(pq);
    huffmanTree.generateCodes();

    //Add each encoded characters together to get the full code
    for (char c : s) 
    {
        encodedMessage += huffmanTree.getCharacterCode(c);
    }

    //Output the encoded string to the screen
    cout << "Encoded message: " << encodedMessage << endl;

    //Decode the string and output it to the screen
    decodedMessage = huffmanTree.decodeMessage(encodedMessage);
    cout << "Decoded message: " << decodedMessage << endl;

    return 0;
}