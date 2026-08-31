def line_wrapper(
    input_string, width: int = 80, print_handler=None, print_handler_args=None
) -> list[str]:
    """Split and maybe print input_string to a given width.

    print_handler is an optional print handler function (e.g. print,iprint,squawk)
        if None, then no printing takes place
    print_handler_args is a dict of named arguments for print_handler
        (e.g. {"num_indents":2})
    Returns a list of strings of width width or less.

    Thanks ChatGPT for the basic code and especially for the tricky syntax
    forwarding optional args to the print hander.
    """
    # If no print handler args just make an empty dict.
    print_handler_args = print_handler_args if print_handler_args else {}

    lines = []
    while len(input_string) > width:
        last_space_index = input_string.rfind(" ", 0, width + 1)

        if last_space_index == -1:
            last_space_index = width

        line = input_string[:last_space_index]
        lines.append(line)

        if print_handler:
            print_handler(line, **print_handler_args)

        input_string = input_string[last_space_index + 1 :]

    lines.append(input_string)

    if print_handler:
        print_handler(input_string, **print_handler_args)

    return lines