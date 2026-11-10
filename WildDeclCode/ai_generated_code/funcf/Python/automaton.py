def graph(self):
        from visual_automata.fa.nfa import VisualNFA
        from forbiddenfruit import curse
        from frozendict import frozendict
        import copy

        def deepcopy(self: frozendict) -> frozendict:
            return copy.deepcopy(self)
        
        curse(frozendict, "deepcopy", deepcopy)

        def pop(self: str) -> str:
            last_char = self[-1]
            self = self[:-1]
            return last_char
        
        curse(str, "pop", pop)

        states: set[State] = set()
        def traverse(state: State):
            if state in states:
                return
            states.add(state)
            for _, nextState in state.transitions.items():
                for state in nextState:
                    traverse(state)

        traverse(self.state)

        all_symbols = set()
        for state in states:
            all_symbols.update(state.transitions.keys())

        transitions = {}
        for state in states:
            transitions[state.name] = {}
            for symbol in all_symbols:
                nextStates = state.getNextState(symbol)
                if nextStates is not None:
                    if len(nextStates) == 1:
                        transitions[state.name][symbol] = nextStates[0].name
                    else:
                        transitions[state.name][symbol] = [nextState.name for nextState in nextStates]

    

        final_states = set([state.name for state in states if state.isFinal])


        nfa = VisualNFA(
            states=set([state.name for state in states]),
            input_symbols=all_symbols,
            transitions=transitions,
            initial_state="S",
            final_states=final_states
        )

        
        return nfa.show_diagram(filename="automaton")