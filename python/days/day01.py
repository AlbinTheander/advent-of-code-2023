"""
--- Day 01: Trebuchet Repairs ---
"""

_DIGITS = list("0123456789")
_NUMS = "zero one two three four five six seven eight nine".split()
_ALL = _DIGITS + _NUMS
_VALUES = dict(zip(_NUMS, _DIGITS))


def day01():
    """
    --- Day 01: main  ---
    """
    lines = read_input()
    print("--- Day 01: Trebuchet Repairs ---")
    print("Part 1:", part1(lines))
    print("Part 2:", part2(lines))


def part1(lines: list[str]) -> int:
    """
    --- Day 01: Part 1 ---
    """
    total = 0
    for line in lines:
        first, last = find_first_and_last(line, _DIGITS)
        total += int(first + last)
    return total


def part2(lines: list[str]) -> int:
    """
    --- Day 01: Part 2 ---
    """
    total = 0
    for line in lines:
        first, last = find_first_and_last(line, _ALL)
        first = _VALUES.get(first, first)
        last = _VALUES.get(last, last)
        total += int(first + last)
    return total


def find_first_and_last(line: str, digits: list[str]) -> tuple[str, str]:
    """
    Find the first and last digit in the line
    """
    first = ""
    first_pos = 1e6
    last = ""
    last_pos = -1e6
    for digit in digits:
        pos = line.find(digit)
        if pos != -1 and pos < first_pos:
            first = digit
            first_pos = pos
        pos = line.rfind(digit)
        if pos != -1 and pos > last_pos:
            last = digit
            last_pos = pos
    return first, last


def read_input():
    """
    Read the input file and return a list of lines
    """
    with open("../data/day01.txt", encoding="utf-8") as f:
        return f.readlines()
