```python
def evaluate_expression(self, expression_node):
    if expression_node.elem_type == "int":
        return expression_node.dict["val"]
    elif expression_node.elem_type == "string":
        return expression_node.dict["val"]
    elif expression_node.elem_type == "+":
        return self.evaluate_addition(expression_node)
    elif expression_node.elem_type == "-":
        return self.evaluate_subtraction(expression_node)
    #the following 4 lines Composed with GitHub coding tools
    elif expression_node.elem_type == "var":
        if (expression_node.dict["name"] not in self.variable_name_to_value):
            super().error(ErrorType.NAME_ERROR, "Variable not defined")
        return self.variable_name_to_value[expression_node.dict["name"]]
    elif expression_node.elem_type == "fcall":
        return self.do_func_call(expression_node)
```