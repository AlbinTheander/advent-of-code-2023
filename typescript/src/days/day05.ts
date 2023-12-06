type Mapping = {
    sourceRange: number,
    destRange: number,
    len: number
}

export function day05(data: string) {
    const [seeds, mappings] = parseData(data);
    console.log(seeds);
    console.log(mappings);
    // const result1 = part1(seeds, mappings);
    const result2 = part12(seeds, mappings);

    // console.log('Total number of points is', result1);
    console.log('Total number of tickets is', result2);
}

function part1(seeds: number[], mappings: Mapping[][]) {
    let best = Infinity;
    for (const seed of seeds) {
        let current = seed;
        for(const conversion of mappings) {
            const mapping = conversion.find(m => m.sourceRange <= current && current < m.sourceRange+m.len);
            if (mapping) {
                current = mapping.destRange + (current - mapping.sourceRange);
            }
        }
        best = Math.min(best, current);
        console.log(seed, current);
    }
    console.log(best);
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

    console.log(best);
}

function part2(seeds: number[], mappings: Mapping[][]) {
    let ranges: number[][] = [];
    for (let i = 0; i < seeds.length; i += 2) 
        ranges.push([seeds[i], seeds[i] + seeds[i+1]]);
    for (const conversion of mappings) {
        console.log(ranges);
        ranges = applyConversion(ranges, conversion);             
    }
    console.log(ranges);
    const best = Math.min(...ranges.map(r => r[0]));
    console.log(best);
}

function applyConversion(ranges: number[][], mappings: Mapping[]) {
    let leftToMap = [...ranges];
    const result: number[][] = [];
    for (const mapping of mappings) {
        const toMapNext = [];
        for (const range of leftToMap) {
            const { leftovers, mapped } =  applyMapping(range, mapping)
            toMapNext.push(...leftovers);
            if (mapped) result.push(mapped);
        }
        leftToMap = toMapNext;
    }
    result.push(...leftToMap);
    return result;
}

function applyMapping(range: number[], mapping: Mapping): { leftovers: number[][], mapped?: number[] } {
    const leftovers: number[][] = [];
    const mapStart = mapping.sourceRange;
    const mapEnd = mapping.sourceRange + mapping.len;
    const mapDelta = mapping.destRange - mapping.sourceRange;
    const [rangeStart, rangeEnd] = range

    if (rangeStart < mapStart) {
        leftovers.push([rangeStart, Math.min(rangeEnd, mapEnd)])
    }
    if (rangeEnd > mapEnd) {
        leftovers.push([Math.max(rangeStart, mapEnd), rangeEnd]);
    }
    const mappedStart = Math.max(rangeStart, mapStart);
    const mappedEnd = Math.min(rangeEnd, mapEnd);
    const mapped = mappedEnd > mappedStart ? [mappedStart + mapDelta, mappedEnd + mapDelta] : undefined;
    if (mapped) {
        console.log('Broke it', mapping, leftovers, mapped)
    }
    return { leftovers, mapped }
}

function parseData(data: string): [number[], Mapping[][]] {
    const lines = data.split('\n');
    const seeds = lines.shift().match(/\d+/g).map(Number);
    lines.shift();
    let currentSource = '';
    let currentDestination = '';
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