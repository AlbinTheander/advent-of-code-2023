export function day11(data: string) {
    const space = data.split('\n').map(line => line.split(''));

    const value1 = part1and2(space, 2);
    const value2 = part1and2(space, 1e6);

    console.log('With just a 2x expansion the total distance is', value1);
    console.log('With 1,000,000x expansion the distance is', value2);
}

function part1and2(space: string[][], expansion: number) {
    let emptyLines = [];
    let emptyCols = [];
    for (let y = space.length-1; y >= 0; y--) {
        if (!space[y].includes('#')) 
            emptyLines.push(y);
    }
    for (let x = space[0].length-1; x >= 0; x--) {
        const col = space.map(line => line[x]);
        if (!col.includes('#'))
            emptyCols.push(x)
    }

    const galaxies: [number, number][] = [];
    for (let y = 0; y < space.length; y++) {
        for (let x = 0; x < space[0].length; x++) {
            if (space[y][x] === '#') galaxies.push([x, y]);
        }
    }

    let sum = 0;
    for (let g1 = 0; g1 < galaxies.length; g1++) {
        for (let g2 = g1+1; g2 < galaxies.length; g2++) {
            let dist = 0;
            let x1 = Math.min(galaxies[g1][0], galaxies[g2][0]);
            let x2 = Math.max(galaxies[g1][0], galaxies[g2][0]);
            let y1 = Math.min(galaxies[g1][1], galaxies[g2][1]);
            let y2 = Math.max(galaxies[g1][1], galaxies[g2][1]);
            for(let x = x1; x < x2; x++) {
                if (emptyCols.includes(x)) {
                    dist += expansion;
                } else {
                    dist += 1;
                }
            }
            for(let y = y1; y < y2; y++) {
                if (emptyLines.includes(y)) {
                    dist += expansion;
                } else {
                    dist += 1;
                }
            }
            sum += dist;
        }
    }
    return sum;
}
