# For evaluating boolean expressions, Assisted with basic coding tools

import itertools

def parse_expression(expression, variables):
    def eval_expr(**vals):
        expr = expression
        for var, val in vals.items():
            expr = expr.replace(var, str(val))
        expr = expr.replace("^", "!=")  # XOR
        expr = expr.replace("v", "or")  # OR
        expr = expr.replace("~", "not ")  # NOT
        return eval(expr)

    return eval_expr


def generate_truth_table(expression):
    variables = sorted(set(filter(str.isalpha, expression)))  # Extract variables
    eval_expr = parse_expression(expression, variables)

    print(" | ".join(variables) + " | Output")
    print("-" * (4 * len(variables) + 9))

    for values in itertools.product([False, True], repeat=len(variables)):
        result = eval_expr(**dict(zip(variables, values)))
        row = " | ".join(str(int(v)) for v in values) + " | " + str(int(result))
        print(row)


expression = "(X ^ Y) or (~X ^ Y ^ ~Z) or (Y ^ Z)"
generate_truth_table(expression)
