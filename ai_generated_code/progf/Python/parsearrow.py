'''
    parsearrow.py
    
    5/10/2024
    
    Designed via basic programming aids
    fixed by Uisang Hwang
'''
import re
from typing import Optional, Tuple, Dict, Any

class ArrowParseError(Exception):
    pass

def _parse_colour(s: str) -> str:
    s = s.strip()
    if not s:
        raise ArrowParseError("Empty color value")
    if re.match(r'^\d{1,3},\d{1,3},\d{1,3}$', s):
        return s  # RGB triplet
    elif re.match(r'^[a-zA-Z0-9]+$', s):
        return s  # color name
    else:
        raise ArrowParseError(f"Invalid color value: {s}")


def extract_suffix(pattern: str) -> Tuple[str, Optional[str]]:
    match = re.search(r'(bf|fb|f|b)$', pattern)
    if match:
        suffix = match.group(1)
        return pattern[: -len(suffix)], suffix
    return pattern, None


def parse_arrow_pattern(pattern: str) -> Dict[str, Any]:
    pattern = pattern.strip()

    # Step 1: Extract and remove suffix
    pattern, suffix = extract_suffix(pattern)

    # Step 2: Extract and remove fill commands like fl(...), fr(...), f(...)
    fill_cmds = re.findall(r'(fl\([^)]*\)|fr\([^)]*\)|f\([^)]*\)|lp\([^)]*\))', pattern)
    pattern = re.sub(r'(fl\([^)]*\)|fr\([^)]*\)|f\([^)]*\)|lp\([^)]*\))', '', pattern)

    # Step 3: Match arrow structure
    arrow_re = re.compile(
        r'^(?P<left>(<<|<\||<)?)'
        r'(?P<body>-?)'
        r'(?P<right>(>>|\|>|>)?)$'
    )
    match = arrow_re.match(pattern)
    if not match:
        raise ArrowParseError(f"Invalid arrow body: '{pattern}'")

    head_map = {
        '<<': 'viking-left',
        '<|': 'closed-left',
        '<': 'open-left',
        '>>': 'viking-right',
        '|>': 'closed-right',
        '>': 'open-right',
    }

    def interpret(h: str) -> Optional[Dict[str, str]]:
        return {'type': head_map[h]} if h else None

    result: Dict[str, Any] = {
        'left_head': interpret(match.group('left')),
        'body': match.group('body') == '-',
        'right_head': interpret(match.group('right')),
        'fill': None,
        'left_fill': None,
        'right_fill': None,
        'lpat': None
    }

    # Step 4: Fill from commands
    for cmd in fill_cmds:
        if cmd.startswith('fl('):
            result['left_fill'] = _parse_colour(cmd[3:-1])
        elif cmd.startswith('fr('):
            result['right_fill'] = _parse_colour(cmd[3:-1])
        elif cmd.startswith('f('):
            result['fill'] = {'type': 'fill', 'color': _parse_colour(cmd[2:-1])}
        elif cmd.startswith('lp('):
            result['lpat'] = cmd[3:-1]

    # Step 5: Fill from suffix if not overridden
    if suffix:
        if result['left_fill'] is None:
            result['left_fill'] = 'w' if 'b' in suffix else 'w'
        if result['right_fill'] is None:
            result['right_fill'] = 'w' if 'b' in suffix else 'w'

    return result
