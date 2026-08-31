#include "PrintTypes.h"

namespace Jack {

std::string to_string(Jack::Token::Type type) {
  switch (type) {
    case Jack::Token::Type::None:
      return "None";
    case Jack::Token::Type::Keyword:
      return "Keyword";
    case Jack::Token::Type::Identifier:
      return "Identifier";
    case Jack::Token::Type::Number:
      return "Number";
    case Jack::Token::Type::String:
      return "String";
    case Jack::Token::Type::Symbol:
      return "Symbol";
    case Jack::Token::Type::Invalid:
      return "Invalid";
    default:
      return "Unreachable";
  }
}
std::string to_string(const Jack::Token& tok) { return tok.value; }

std::string to_string(const std::vector<Jack::Token>& tokens) {
  std::string str = "[";
  for (size_t i = 0; i < tokens.size(); i++) {
    str += '\"' + to_string(tokens.at(i)) + '\"';
    if (i != tokens.size() - 1) {
      str += ", ";
    }
  }
  str += "]";
  return str;
}

std::ostream& operator<<(std::ostream& o, Jack::Token::Type type) {
  o << to_string(type);
  return o;
}
std::ostream& operator<<(std::ostream& o, const Jack::Token& token) {
  o << to_string(token);
  return o;
}
std::ostream& operator<<(std::ostream& o,
                         const std::vector<Jack::Token>& tokens) {
  o << to_string(tokens);
  return o;
}

std::string to_string(Jack::ParseTree::Type type) {
  switch (type) {
    case Jack::ParseTree::Type::Class:
      return "Class";
    case Jack::ParseTree::Type::ClassVarDec:
      return "ClassVarDec";
    case Jack::ParseTree::Type::Subroutine:
      return "Subroutine";
    case Jack::ParseTree::Type::ParameterList:
      return "ParameterList";
    case Jack::ParseTree::Type::SubroutineBody:
      return "SubroutineBody";
    case Jack::ParseTree::Type::VarDec:
      return "VarDec";
    case Jack::ParseTree::Type::Statements:
      return "Statements";
    case Jack::ParseTree::Type::LetStatement:
      return "LetStatement";
    case Jack::ParseTree::Type::DoStatement:
      return "DoStatement";
    case Jack::ParseTree::Type::IfStatement:
      return "IfStatement";
    case Jack::ParseTree::Type::WhileStatement:
      return "WhileStatement";
    case Jack::ParseTree::Type::ReturnStatement:
      return "ReturnStatement";
    case Jack::ParseTree::Type::Expression:
      return "Expression";
    case Jack::ParseTree::Type::Term:
      return "Term";
    case Jack::ParseTree::Type::ExpressionList:
      return "ExpressionList";
    case Jack::ParseTree::Type::Keyword:
      return "Keyword";
    case Jack::ParseTree::Type::Identifier:
      return "Identifier";
    case Jack::ParseTree::Type::Number:
      return "Number";
    case Jack::ParseTree::Type::String:
      return "String";
    case Jack::ParseTree::Type::Symbol:
      return "Symbol";
    default:
      return "Unreachable";
  }
}

// Supported via standard programming aids
std::string to_string(const Jack::ParseTree& parseTree, int indent = 0) {
  std::string result;

  // Print the token information if available
  if (!parseTree.getValue().empty()) {
    result += std::string(indent, ' ') + '\"' + parseTree.getValue() + "\"";
  } else {
    // Print the type of the node
    result += std::string(indent, ' ') + Jack::to_string(parseTree.getType()) +
              ": [\n";
    // Recursively process child nodes
    for (auto child = parseTree.getChildren().cbegin();
         child < parseTree.getChildren().cend(); child++) {
      result += to_string(*child, indent + 2);
      if (child + 1 < parseTree.getChildren().cend()) {
        result += ",\n";
      } else {
        result += "]";
      }
    }
  }

  return result;
}

std::ostream& operator<<(std::ostream& o, const Jack::ParseTree& pt) {
  o << to_string(pt);
  return o;
}
std::ostream& operator<<(std::ostream& o, Jack::ParseTree::Type type) {
  o << to_string(type);
  return o;
}

std::string to_string(const SymbolTable& table) {
  std::string out = "[ ";
  std::unordered_map<std::string, Jack::Symbol>::const_iterator it = table.cbegin();
  while (it != table.cend()) {
    out += to_string(it->second) + ", ";
    it++;
  }
  return out + " ]";
}
std::string to_string(const Symbol& symbol) {
  return "{ " + symbol.name + ", " + symbol.type + ", " +
         to_string(symbol.segment) + ", " + std::to_string((int)symbol.offset) +
         " }";
}
std::string to_string(const Symbol::MemorySegment& segment) {
  switch (segment) {
    case Jack::Symbol::MemorySegment::Local:
      return "Local";
    case Jack::Symbol::MemorySegment::Argument:
      return "Argument";
    case Jack::Symbol::MemorySegment::Field:
      return "Field";
    case Jack::Symbol::MemorySegment::Static:
      return "Static";
    default:
      return "Unreachable";
  }
}

std::ostream& operator<<(std::ostream& o, const SymbolTable& table) {
  o << to_string(table);
  return o;
}
std::ostream& operator<<(std::ostream& o, const Symbol& symbol) {
  o << to_string(symbol);
  return o;
}
std::ostream& operator<<(std::ostream& o,
                         const Symbol::MemorySegment& segment) {
  o << to_string(segment);
  return o;
}

}  // namespace Jack