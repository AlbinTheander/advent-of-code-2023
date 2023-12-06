export function day06(data: string) {
    const lines = data.split('\n');
    const times = lines[0].match(/\d+/g).map(Number);
    const distances = lines[1].match(/\d+/g).map(Number);
    const bigtime = +lines[0].match(/\d+/g).reduce((a, b) => a + b)
    const bigDistance = +lines[1].match(/\d+/g).reduce((a, b) => a + b)

    const result1 = part1(times, distances);
    const result2 = part1([bigtime], [bigDistance]);
    console.log('The product of the race winns are', result1);
    console.log('The number of ways to win the big race is', result2);
}

function part1(times: number[], distances: number[]) {
    let total = 1;
    for (let race = 0; race < times.length; race++) {
        const time = times[race];
        const distance = distances[race];
        let hits = 0;
        for (let t = 0; t < time; t++) {
            const myDistance = (time - t) * t;
            if (myDistance > distance) hits++;
        }
        total *= hits;
    }
    return total;
}