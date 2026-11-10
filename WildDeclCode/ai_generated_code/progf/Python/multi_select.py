"""
This terrible code was Assisted with routine coding tools-4o, and desperately needs to be rewritten
docstring TODO
"""

from blessed import Terminal


def launch_multi_select(options: list[str]) -> list[str]:
    """
    This terrible code was Assisted with routine coding tools-4o, and desperately needs to be rewritten

    docstring TODO
    """
    term = Terminal()
    selected = [False] * len(options)
    cursor = 0
    running = True

    instruction = "Select the options you want to proceed with (use ↑ ↓ to navigate, Enter to toggle/select, 'q' to quit):"

    def draw():
        print(term.clear())
        print(term.bold_underline(instruction) + "\n")

        for i, (opt, sel) in enumerate(zip(options, selected)):
            line = f"[{'x' if sel else ' '}] {opt}"
            if i == cursor:
                print(term.reverse(line))
            else:
                print(line)

        print("\n")
        proceed_str = "[ Proceed ]"
        exit_str = "[ Exit ]"
        if cursor == len(options):  # proceed
            print(term.reverse(proceed_str), exit_str)
        elif cursor == len(options) + 1:  # exit
            print(proceed_str, term.reverse(exit_str))
        else:
            print(proceed_str, exit_str)

    with term.cbreak(), term.hidden_cursor():
        draw()
        while running:
            key = term.inkey()

            if key.code == term.KEY_UP:
                cursor = (cursor - 1) % (len(options) + 2)
            elif key.code == term.KEY_DOWN:
                cursor = (cursor + 1) % (len(options) + 2)
            elif key.code in (term.KEY_ENTER, term.KEY_RETURN):
                if cursor < len(options):
                    selected[cursor] = not selected[cursor]
                elif cursor == len(options):  # Proceed
                    return [opt for opt, sel in zip(options, selected) if sel]
                elif cursor == len(options) + 1:  # Exit
                    exit()
            elif key.lower() == "q":  # Quick exit
                exit()

            draw()


# Example usage
if __name__ == "__main__":
    result = launch_multi_select(
        [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4",
            "Option 5",
        ]
    )
    print("\nSelected:", result)
