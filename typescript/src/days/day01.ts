const LONGDIGITS = '0 1 2 3 4 5 6 7 8 9 zero one two three four five six seven eight nine'.split(' ');
const DIGITS = '0 1 2 3 4 5 6 7 8 9'.split(' ')

export function day01(data: string) {
    const lines = data.split('\n');

    const value1 = sumFirstAndLast(lines, DIGITS);
    const value2 = sumFirstAndLast(lines, LONGDIGITS);

    console.log('The calibration value is', value1);
    console.log('The correct calibration value is', value2);
}

function sumFirstAndLast(lines: string[], digits: string[]): number {
    return lines.
        map(line => firstDigit(line, digits) * 10 + lastDigit(line, digits)).
        reduce((a, b) => a + b);
}

function firstDigit(s: string, digits: string[]): number {
    for (let p = 0; p <= s.length; p++) {
        for(let d = 0; d < digits.length; d++) {
            if (s.slice(0, p).endsWith(digits[d])) return d % 10;
        }
    }
    return 0;
}

function lastDigit(s: string, digits: string[]): number {
    for (let p = s.length-1; p >= 0; p--) {
        for(let d = 0; d < digits.length; d++) {
            if (s.slice(p).startsWith(digits[d])) return d % 10;
        }
    }
    return 0;
}

