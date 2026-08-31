//Most of this code was Composed with basic coding tools
//It did a good lob but didn't quite work
//I think I have corrected it - but user beware!!
#include "Parser.h"

int main() 
{
    std::string expression;
    while  (true)
    {
      std::cout << "Enter a numerical calculation: ";
      std::getline(std::cin, expression);
      std::cout << "Result: " << evaluate(expression) << std::endl;
    }
    return 0;
}

