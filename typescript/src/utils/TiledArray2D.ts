export class TiledArray2D<Value> {
    readonly width: number;
    readonly height: number;

    constructor(public data: Value[][]) {
        this.height = data.length;
        this.width = data[0].length;
    }

    contains(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    set(x: number, y: number, value: Value) {
        this.data[rem(y, this.height)][rem(x, this.width)] = value;
    }

    get(x: number, y: number): Value {
        return this.data[rem(y, this.height)][rem(x, this.width)];
    }

    getRealPos(x: number, y: number): { x: number; y: number } {
        return {
            x: rem(x, this.width),
            y: rem(y, this.height),
        };
    }

    toString() {
        return this.data.map((line) => line.join("")).join("\n");
    }
}

function rem(num: number, mod: number) {
    return ((num % mod) + mod) % mod;
}

export const toTiledChar2D = (data: string): TiledArray2D<string> =>
    new TiledArray2D(data.split("\n").map((line) => line.split("")));

export const toTiledNum2D = <OutsideValue>(
    data: string
): TiledArray2D<number> =>
    new TiledArray2D(
        data.split("\n").map((line) => line.split("").map(Number))
    );
