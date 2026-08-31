def _check_call_method(self):
    '''
    Assisted with basic coding tools. Checks whether the child method "call" exists and
    if all required variables existed in the attribute_dict
    '''
    child_instance = self
    call_method = getattr(child_instance, 'call', None)

    if call_method and inspect.ismethod(call_method):
        call_method_source = inspect.getsource(call_method)
        required_attributes = self._get_required_attributes(call_method_source)

        for attribute in required_attributes:
            if not hasattr(child_instance, attribute):
                raise AttributeError(f"{type(self).__name__}.call is requiring attribute: {attribute}")
    else:
        raise AttributeError(f"{type(self).__name__} class does not have a valid `call` method.")


def _get_required_attributes(self, method_source):
    '''
    Assisted with basic coding tools. Retrieves als attributes being used in
    the childs 'call' method
    '''

    method_source = textwrap.dedent(method_source)
    method_ast = ast.parse(method_source)
    required_attributes = []

    for node in ast.walk(method_ast):
        if (
            isinstance(node, ast.Attribute)
            and isinstance(node.value, ast.Name)
            and node.value.id == 'self'
        ):
            attribute_name = node.attr
            if attribute_name not in required_attributes:
                required_attributes.append(attribute_name)

    return required_attributes