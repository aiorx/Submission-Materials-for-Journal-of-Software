#pragma once

//function comes Derived using common development resources and update it a little
float evaluateFormula(String formula) {
  // Remove all whitespaces from the formula
  formula.replace(" ", "");

  // Temporary variables for number and operator
  float num = 0;
  char op = '+';

  // Variables to keep track of the accumulated result and the term value
  float result = 0;
  float term = 0;

  // Process each character in the formula
  for (int i = 0; i < formula.length(); i++) {
    char ch = formula.charAt(i);

    // If the character is a digit or decimal point, extract the whole number
    if (isdigit(ch) || ch == '.') {
      String numString = "";
      while (i < formula.length() && (isdigit(formula.charAt(i)) || formula.charAt(i) == '.')) {
        numString += formula.charAt(i);
        i++;
      }
      i--;

      // Convert the number string to a float
      num = numString.toFloat();

      // Apply the operator to the accumulated result
      if (op == '+') {
        result += term;
        term = num;
      } else if (op == '-') {
        result += term;
        term = -num;
      } else if (op == '*') {
        term *= num;
      } else if (op == '/') {
        term /= num;
      }
    }
    // If the character is an operator (+, -, *, /), update the current operator
    else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
      op = ch;
    }
  }

  // Add the last term to the accumulated result
  result += term;

  return result;
}

bool hasParenthese(String formula)
{
  int index = formula.indexOf('(');
  return index >= 0;
}

// chat gpt cannot handle a formular include '()', so I Write it byself 
float CalcFormula(String formula, bool & result)
{
  formula.replace(" ", "");
  while (hasParenthese(formula))
  {
    int start_index = formula.lastIndexOf('(');
    int end_index = formula.indexOf(')', start_index);
    if (end_index < 0)
    {
      result = false;
      return -9999.0;
    }

    String subFormula = formula.substring(start_index + 1, end_index);
    //Serial.println("sub: " + subFormula);
    float value = CalcFormula(subFormula, result);
    if (result) {
      formula.replace("(" + subFormula + ")", String(value));
      //Serial.println("new formu: " + formula);
    } else {
      Serial.println("failed: ");
      return result;
    }
  }

  result = true;
  return evaluateFormula(formula);
}
