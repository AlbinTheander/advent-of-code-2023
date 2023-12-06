type Mapping = {
    sourceRange: number,
    destRange: number,
    len: number
}

export function day05(data: string) {
    const [seeds, mappings] = parseData(data);
    const result1 = part1(seeds, mappings);
    const result2 = part2(seeds, mappings);

    console.log('Total number of points is', result1);
    console.log('Total number of tickets is', result2);
}

function part1(seeds: number[], mappings: Mapping[][]) {
    let best = Infinity;
    for (const seed of seeds) {
        const plot = findPlot(seed, mappings);
        best = Math.min(best, plot);
    }
    return best;
}

function part2(seeds: number[], mappings: Mapping[][]) {
    let best = Infinity;
    for (let seedIdx = 0; seedIdx < seeds.length; seedIdx += 2) {
        const first = seeds[seedIdx];
        const last = first + seeds[seedIdx + 1];
        for (let seed = first; seed < last; seed++) {
            const plot = findPlot(seed, mappings);
            best = Math.min(best, plot);
        }
    }
    return best;
}

function part12(seeds: number[], mappings: Mapping[][]) {
    let best = Infinity;
    for (let seedIdx = 0; seedIdx < seeds.length; seedIdx += 2) {
        const first = seeds[seedIdx];
        const last = first + seeds[seedIdx + 1];
        for (let seed = first; seed < last; seed++) {
            let current = seed;
            for(const conversion of mappings) {
                const mapping = conversion.find(m => m.sourceRange <= current && current < m.sourceRange+m.len);
                if (mapping) {
                    current = mapping.destRange + (current - mapping.sourceRange);
                }
            }
            if (current < best) {
                best = current;
                console.log('new best', seed, best);
            }
        }
    }

    return best;
}

function findPlot(seed: number, mappings: Mapping[][]): number {
    let current = seed;
    for(const conversion of mappings) {
        const mapping = conversion.find(m => m.sourceRange <= current && current < m.sourceRange+m.len);
        if (mapping) {
            current = mapping.destRange + (current - mapping.sourceRange);
        }
    }
    return current;
}

function parseData(data: string): [number[], Mapping[][]] {
    const lines = data.split('\n');
    const seeds = lines.shift().match(/\d+/g).map(Number);
    lines.shift();
    const mappings: Mapping[][] = [];
    let currentMapping: Mapping[] = [];
    for(const line of lines) {
        if (line === '') {
            mappings.push(currentMapping);
            currentMapping = [];
        }
        const nums = line.match(/\d+/g)
        if (nums) {
            const [destRange, sourceRange, len] = nums.map(Number);
            currentMapping.push({destRange, sourceRange, len });
        }
    }
    mappings.push(currentMapping);

    return [seeds, mappings]
}