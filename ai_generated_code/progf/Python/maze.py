# maze has been Supported via standard programming aids with the following request:
'''You are engaged in maze construction. Each maze has an entrance (symbol 'O'),
an exit (symbol 'X'), and walls (symbol '#'). The maze is represented as a
Python array with dimensions MxN and is named maze.
Generate a maze that contains only many dead ends and only one correct path,
with dimensions 10 by 10.'''

maze = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
    ['O', ' ', '#', ' ', '#', ' ', '#', ' ', '#', '#'],
    ['#', ' ', '#', ' ', '#', ' ', '#', ' ', ' ', '#'],
    ['#', ' ', '#', ' ', '#', ' ', '#', '#', ' ', '#'],
    ['#', ' ', ' ', ' ', '#', ' ', ' ', '#', ' ', '#'],
    ['#', '#', '#', ' ', '#', '#', ' ', '#', ' ', 'X'],
    ['#', ' ', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#'],
    ['#', ' ', '#', '#', ' ', '#', ' ', ' ', ' ', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
]