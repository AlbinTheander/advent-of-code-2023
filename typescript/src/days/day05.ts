type Mapping = {
    sourceRange: number;
    destRange: number;
    len: number;
};

type Transformation = Mapping[];
type Interval = { start: number; len: number };

export function day05(data: string) {
    const [seeds, mappings] = parseData(data);
    const result1 = part1(seeds, mappings);
    const result2 = part2(seeds, mappings);

    console.log("The plot with the lowest number is", result1);
    console.log("Total lowest plot of the intervals is", result2);
}

function part1(seeds: number[], mappings: Mapping[][]) {
    let best = Infinity;
    for (const seed of seeds) {
        const plot = findPlot(seed, mappings);
        best = Math.min(best, plot);
    }
    return best;
}

function part2(seeds: number[], transformations: Transformation[]) {
    let intervals: Interval[] = [];
    for (let i = 0; i < seeds.length; i += 2)
        intervals.push({ start: seeds[i], len: seeds[i + 1] });
    
    for (const transformation of transformations) {
        intervals = applyTransformation(intervals, transformation);
    }
    const best = Math.min(...intervals.map((i) => i.start));
    return best;
}

function applyTransformation(intervals: Interval[], transformation: Transformation): Interval[] {
    const result = [];
    let intervalsLeft = intervals;
    for (let mapping of transformation) {
        const nextIntervals = [];
        for (const interval of intervalsLeft) {
            const [start, mid, end] = splitInterval(interval, mapping);
            if (start) nextIntervals.push(start);
            if (end) nextIntervals.push(end);
            if (mid) {
                result.push({
                    start: mid.start + mapping.destRange - mapping.sourceRange,
                    len: mid.len,
                });
            }
        }
        intervalsLeft = nextIntervals;
    }
    result.push(...intervalsLeft);
    return result;
}

function splitInterval(interval: Interval, mapping: Mapping): Interval[] {
    const mStart = mapping.sourceRange;
    const mEnd = mapping.sourceRange + mapping.len;
    let before = null;
    const iStart = interval.start;
    const iEnd = interval.start + interval.len;
    if (iStart < mStart) {
        const beforeStart = iStart;
        const beforeEnd = Math.min(iEnd, mStart);
        before = { start: beforeStart, len: beforeEnd - beforeStart };
    }
    let mid = null;
    if (iStart < mEnd && iEnd > mStart) {
        const midStart = Math.max(iStart, mStart);
        const midEnd = Math.min(iEnd, mEnd);
        mid = { start: midStart, len: midEnd - midStart };
    }
    let end = null;
    if (iEnd > mEnd) {
        const endStart = Math.max(iStart, mEnd);
        const endEnd = iEnd;
        end = { start: endStart, len: endEnd - endStart };
    }
    return [before, mid, end];
}

function findPlot(seed: number, mappings: Mapping[][]): number {
    let current = seed;
    for (const conversion of mappings) {
        const mapping = conversion.find(
            (m) => m.sourceRange <= current && current < m.sourceRange + m.len
        );
        if (mapping) {
            current = mapping.destRange + (current - mapping.sourceRange);
        }
    }
    return current;
}

function parseData(data: string): [number[], Mapping[][]] {
    const lines = data.split("\n");
    const seeds = lines.shift().match(/\d+/g).map(Number);
    lines.shift();
    const mappings: Mapping[][] = [];
    let currentMapping: Mapping[] = [];
    for (const line of lines) {
        if (line === "") {
            mappings.push(currentMapping);
            currentMapping = [];
        }
        const nums = line.match(/\d+/g);
        if (nums) {
            const [destRange, sourceRange, len] = nums.map(Number);
            currentMapping.push({ destRange, sourceRange, len });
        }
    }
    mappings.push(currentMapping);

    return [seeds, mappings];
}
