"""
Day 2: Cube Conundrum
"""


def day02():
    """
    Day 2: Cube Conundrum
    """
    games = read_input()
    answer1 = part1(games)
    answer2 = part2(games)

    print("--- Day 02: Cube Conundrum ---")
    print(f"Part 1: {answer1}")
    print(f"Part 2: {answer2}")


def part1(games):
    """
    Part 1: How many games are possible?
    """
    total = 0
    for game in games:
        if is_possible(game):
            total += game["id"]

    return total


def is_possible(game):
    """
    Determine if a game is possible
    """
    rounds = game["rounds"]

    return all(is_possible_round(round) for round in rounds)


def is_possible_round(game_round):
    """
    Determine if a round is possible
    """
    reds = game_round.get("red", 0)
    greens = game_round.get("green", 0)
    blues = game_round.get("blue", 0)
    return reds <= 12 and greens <= 13 and blues <= 14


def part2(games):
    """
    Part 2: The sum of the power of all games
    """
    total = 0
    for game in games:
        total += game_power(game)

    return total


def game_power(game):
    """
    Calculate the power of a game
    """
    red = 0
    green = 0
    blue = 0
    rounds = game["rounds"]
    for r in rounds:
        red = max(red, r.get("red", 0))
        green = max(green, r.get("green", 0))
        blue = max(blue, r.get("blue", 0))
    return red * green * blue


def read_input():
    """
    Read the input file and return a list of games
    """
    games = []

    def to_balls(s):
        """
        Convert a string to a tuple of color and count
        """
        count, color = s.split(" ")
        return [color, int(count)]

    with open("../data/day02.txt", encoding="utf-8") as f:
        lines = f.read().splitlines()
        for line in lines:
            header, rest = line.split(": ")
            game_id = int(header.split(" ")[1])
            round_data = rest.split("; ")
            rounds = []
            for a_round in round_data:
                counts = dict(map(to_balls, a_round.split(", ")))
                rounds.append(counts)

            games.append({"id": game_id, "rounds": rounds})

    return games
