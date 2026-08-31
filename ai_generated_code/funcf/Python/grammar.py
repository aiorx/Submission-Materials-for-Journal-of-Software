```python
def init_follow(self):
    # TO-DO
    # Supported via standard GitHub programming aids, to be refactored
    self._follow = {}
    for non_term in self._non_terminals:
        self._follow[non_term] = set()
    self._follow[self.start_symbol] = set([Symbol(END_OF_INPUT)])
    
    # Assumption: max iterations equals the number of productions
    for _ in range(len(self.productions)):
        for production in self.productions:
            head_symbol = production.head
            body_symbols = production.body
            for i, symbol in enumerate(body_symbols):
                # If the symbol is a non-terminal
                if symbol in self._non_terminals:
                    # If the symbol is the last in the body, add the FOLLOW set of the head to its FOLLOW set
                    if i == len(body_symbols) - 1:
                        self._follow[symbol] |= self._follow[head_symbol]
                    else:
                        added_terminal = False
                        for j in range(i + 1, len(body_symbols)):
                            next_symbol = body_symbols[j]
                            # If the next symbol is a terminal, add it to the current symbol's FOLLOW set
                            if next_symbol in self._terminals:
                                self._follow[symbol].add(next_symbol)
                                added_terminal = True
                                break
                            # If the next symbol is a non-terminal, add its FIRST set (minus EPSILON) to the current symbol's FOLLOW set
                            elif next_symbol in self._non_terminals:
                                self._follow[symbol] |= (self._first[next_symbol] - {Symbol(EPSILON)})
                                # If EPSILON is not in the next symbol's FIRST set, break the loop
                                if Symbol(EPSILON) not in self._first[next_symbol]:
                                    added_terminal = True
                                    break
                        # If the loop finished without breaking, it means all symbols after the current one can derive EPSILON
                        # So, add the FOLLOW set of the head to the current symbol's FOLLOW set
                        if not added_terminal:
                            self._follow[symbol] |= self._follow[head_symbol]
```