package github.dctime.dctimesignals.lib;

public class StringToSignalOperation {
    // Parser is Crafted with standard coding tools
    private static class Parser {
        private final String input;
        private final int a, b, c;
        private int pos = 0;

        Parser(String input, int a, int b, int c) {
            this.input = input.replaceAll("\\s", ""); // Remove spaces
            this.a = a;
            this.b = b;
            this.c = c;
        }

        int parseExpression() {
            if (input.isEmpty()) {
                return 0;
            }
            int value = parseOr();
            while (true) {
                if (match('+')) {
                    value = applyBinary('+', value, parseOr());
                } else if (match('-')) {
                    value = applyBinary('-', value, parseOr());
                } else {
                    break;
                }
            }
            return value;
        }

        int parseOr() {
            int value = parseAnd();
            while (true) {
                if (match('|')) {
                    value = applyBinary('|', value, parseAnd());
                } else {
                    break;
                }
            }
            return value;
        }

        int parseAnd() {
            int value = parseFactor();
            while (true) {
                if (match('&')) {
                    value = applyBinary('&', value, parseFactor());
                } else {
                    break;
                }
            }
            return value;
        }

        int parseFactor() {
            if (match('~')) {
                return ~parseFactor();
            } else if (match('(')) {
                int value = parseExpression();
                if (!match(')')) {
                    throw new RuntimeException("Expected closing ')'");
                }
                return value;
            } else if (peek() == 'A' || peek() == 'B' || peek() == 'C') {
                char var = input.charAt(pos++);
                return switch (var) {
                    case 'A' -> a;
                    case 'B' -> b;
                    case 'C' -> c;
                    default -> throw new RuntimeException("Unknown variable: " + var);
                };
            } else {
                throw new RuntimeException("Unexpected character at position " + pos + ": '" + peek() + "'");
            }
        }

        boolean match(char ch) {
            if (pos < input.length() && input.charAt(pos) == ch) {
                pos++;
                return true;
            }
            return false;
        }

        char peek() {
            return pos < input.length() ? input.charAt(pos) : '\0';
        }

        int applyBinary(char op, int left, int right) {
            return switch (op) {
                case '+' -> left + right;
                case '-' -> left - right;
                case '&' -> left & right;
                case '|' -> left | right;
                default -> throw new RuntimeException("Unknown binary operator: " + op);
            };
        }
    }

    public static SignalOperationString fromString(String operation1, String operation2, String operation3) {
        // "~(A&B|C)+A-B"
        // parse the string and return a SignalOperationString
        return (a, b, c) -> {
            Parser parser1 = new Parser(operation1, a, b, c);
            Parser parser2 = new Parser(operation2, a, b, c);
            Parser parser3 = new Parser(operation3, a, b, c);
            return new int[] { parser1.parseExpression(), parser2.parseExpression(), parser3.parseExpression() };
        };


    }
}
