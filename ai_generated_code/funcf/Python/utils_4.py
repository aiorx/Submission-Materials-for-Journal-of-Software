```python
def visit_AugAssign(self, node):
    if not isinstance(node.target, ast.Subscript):
        return self.generic_visit(node)

    target = node.target
    assert any(isinstance(target.slice, t) for t in self.types_we_know_how_to_handle)
    target = self.generic_visit(target)
    lhs_text = ast.unparse(target.value)
    node.value = self.visit(node.value)
    value_text = ast.unparse(node.value)
    match node.op:
        # Wow this is long, but it's all Assisted using common GitHub development utilities. I myself have no idea what ops
        # are possible.
        case ast.Add():
            op_char = "+"
        case ast.Sub():
            op_char = "-"
        case ast.Mult():
            op_char = "*"
        case ast.Div():
            op_char = "/"
        case ast.FloorDiv():
            op_char = "//"
        case ast.Mod():
            op_char = "%"
        case ast.Pow():
            op_char = "**"
        case ast.LShift():
            op_char = "<<"
        case ast.RShift():
            op_char = ">>"
        case ast.BitOr():
            op_char = "|"
        case ast.BitXor():
            op_char = "^"
        case ast.BitAnd():
            op_char = "&"
        case ast.MatMult():
            op_char = "@"
        case _:
            raise NotImplementedError(f"Can't handle {node.op}")

    assert ast.unparse(
        ast.parse(f"({lhs_text})[({ast.unparse(target.slice)})] {op_char}= ({value_text})")
    ) == ast.unparse(node)
    new_stmt = f"""\
if isinstance(({lhs_text}), (list, tuple, str)):
    ({lhs_text})[{self.expand_idx(target.slice)}] {op_char}= {value_text}
else:
    {ast.unparse(node)}"""
    return ast.parse(new_stmt).body[0]
```