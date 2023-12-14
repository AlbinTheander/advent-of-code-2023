type Pattern = {
    rows: string[];
    cols: string[];
}

export function day13(data: string) {
    const patterns = parseData(data);
    const value1 = part1(patterns);
    const value2 = part2(patterns);
    console.log('The sum of all the notes is', value1)
    console.log('The sum of all the modified notes is', value2)
}

function part1(patterns: Pattern[]) {
    let sum = 0;
    for (const pattern of patterns) {
        let score = 0;
        score += findReflection(pattern.rows) * 100;
        score += findReflection(pattern.cols);
        sum += score;
    }
    return sum;
}

function part2(patterns: Pattern[]) {
    let sum = 0;
    for (const pattern of patterns) {
        const rowScore = findReflection(pattern.rows);
        const colScore = findReflection(pattern.cols);
        const score = findOtherScore(pattern, rowScore, colScore);
        sum += score;
    }
    return sum;
}

function findOtherScore(pattern: Pattern, originalRowScore: number, originalColScore: number) {
    const { rows, cols } = pattern;
    for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[0].length; c++) {
            const newRows = rows.map((row, ri) => ri == r ? toggle(row, c) : row)
            const newCols = cols.map((col, ci) => ci == c ? toggle(col, r) : col)

            const rowScore = findReflection(newRows, originalRowScore);
            const colScore = findReflection(newCols, originalColScore);
            if (rowScore && rowScore !== originalRowScore) return rowScore * 100;
            if (colScore && colScore !== originalColScore) return colScore;
        }
    }
}

function toggle(s: string, pos: number) {
    const newCh = s[pos] === '#' ? '.' : '#';
    return s.slice(0, pos) + newCh + s.slice(pos+1);
}


function findReflection(rows: string[], forbidden: number = NaN) {
    for (let i = 0; i < rows.length - 1; i++) {
        let left = i;
        let right = i+1;
        while (left >= 0 && right < rows.length && rows[left] === rows[right]) {
            left--;
            right++;
        }
        if (left === -1 || right === rows.length) {
            if (i+1 !== forbidden) return i+1;
        }
    }
    return 0;
}

function parseData(data: string): Pattern[] {
    const patterns = data.split('\n\n');
    return patterns.map(p => {
        const rows = p.split('\n');
        const cols = Array(rows[0].length)
            .fill(0)
            .map((_, i) => rows.map(r => r[i]).join(''));

        return { rows, cols }
    })
}


