type Draw = Record<string, number>
type Game = {
    id: number,
    draws: Draw[];
}

export function day02(data: string) {
    const games = data.split('\n').map(createGame);

    const validGames = part1(games);
    const totalPower = part2(games);

    console.log('The sum of the ids of the possible games is', validGames);
    console.log('The total power of the games is', totalPower);
}

function part1(games: Game[]) {
    const limits = { red: 12, green: 13, blue: 14 };
    const isValidDraw = (draw: Draw) => Object.entries(draw).every(([colour, count]) => count <= limits[colour]);
    const validGames = games.filter(game => game.draws.every(isValidDraw))

    const result = validGames.reduce((n, game) => n += game.id, 0)
    return result
}

function part2(games: Game[]): number {
    let sum = 0;
    for (const game of games) {
        let red = 0, green = 0, blue = 0;
        for (const draw of game.draws) {
            red = Math.max(red, draw.red || 0);
            green = Math.max(green, draw.green || 0);
            blue = Math.max(blue, draw.blue || 0);
        }
        sum += red * green * blue;
    }
    return sum;
}

// Game 1: 4 red, 8 green; 8 green, 6 red; 13 red, 8 green; 2 blue, 4 red, 4 green
function createGame(s: string): Game {
    const colonPos = s.indexOf(':')
    const id = +s.slice("Game ".length, colonPos);
    const drawStrings = s.slice(colonPos + 1).split(';');
    const draws: Draw[] = [];
    for (const drawString of drawStrings) {
        const ballStrings = drawString.split(', ');
        const draw: Record<string, number> = {}
        for (const ballString of ballStrings) {
            const [num, ball] = ballString.trim().split(' ');
            draw[ball] = +num;
        }
        draws.push(draw);
    }

    return {
        id,
        draws
    }
}

