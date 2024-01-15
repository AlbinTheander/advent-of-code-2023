
export function lcm(...nums: number[]): number {
    let result = 1;
    for (let n of nums) {
        result = result * n / gcm(result, n);
    }
    return result;
}

export function gcm(a: number, b: number): number {
    if (b > a) return gcm(b, a);
    if (b === 0) return a;
    return gcm(b, a % b);
}
