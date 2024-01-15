import { lcm } from "../utils/math";

type Circuit = {
    name: string;
    type: string;
    targets: string[];
    on: boolean;
    inputs: [string, number][];
    onReceive?: (from: string, signal: number) => boolean;
};

export function day20(data: string) {
    let circuits = parseData(data);
    const result1 = part1(circuits);
    
    // reset circuits
    circuits = parseData(data);
    const result2 = part2(circuits);

    console.log('The product of high and low signals after 1000 pushes is', result1)
    console.log('rx will get a high signal after', result2, 'presses')
}

function part1(circuits: Circuit[]) {
    let lows = 0,
        highs = 0;
    for (let i = 0; i < 1000; i++) {
        const [low, high] = simulate(circuits);
        lows += low;
        highs += high;
    }

    return highs * lows;
}

function part2(circuits: Circuit[]) {
    // We checked the data, and there is only one incoming circuit
    const toRx = circuits.find((c) => c.targets.includes("rx"));
    const foundParts: Record<string, number> = {}
    let buttonPresses = 0;
    toRx.onReceive = (from: string, signal: number) => {
        if (signal === 1 && !(from in foundParts)) {
            foundParts[from] = buttonPresses;
        } 
        return true;
    }
    while(Object.keys(foundParts).length < toRx.inputs.length) {
        buttonPresses++
        simulate(circuits);
    }
    const loopLengths = Object.values(foundParts);
    return lcm(...loopLengths);
}

function simulate(circuits: Circuit[]) {
    let toSend: [string, number][] = [["broadcaster", 0]];
    const sent = [1, 0];

    while (toSend.length > 0) {
        const pulses = toSend;
        toSend = [];
        for (const pulse of pulses) {
            const [source, signal] = pulse;
            const circuit = circuits.find((c) => c.name === source);

            for (const targetId of circuit.targets) {
                if (signal === 0) sent[0]++;
                else sent[1]++;
                // console.log('Sending', source, '->', signal, '->', targetId)
                const target = circuits.find((c) => c.name === targetId);
                if (!target) continue;
                if (target.onReceive) target.onReceive(source, signal);
                switch (target.type) {
                    case "%":
                        if (signal === 0) {
                            target.on = !target.on;
                            const newSignal = target.on ? 1 : 0;
                            toSend.push([target.name, newSignal]);
                        }
                        break;
                    case "&":
                        const index = target.inputs.findIndex(
                            (inp) => inp[0] === source
                        );
                        target.inputs[index][1] = signal;
                        const newSignal = target.inputs.every(
                            (inp) => inp[1] === 1
                        )
                            ? 0
                            : 1;
                        toSend.push([target.name, newSignal]);
                        break;
                    default:
                        throw "Unknwon circuit type";
                }
            }
        }
    }
    return sent;
}

function getSignal(circuit: Circuit): number {
    switch (circuit.type) {
        case "b":
            return 0;
        case "%":
            return circuit.on ? 1 : 0;
        case "&":
            return circuit.inputs.every((inp) => inp[1] === 1) ? 0 : 1;
    }
    throw Error("Unknown type");
}

function parseData(data: string): Circuit[] {
    const lines = data.split("\n");

    const circuits = lines.map((line) => {
        const names = line.match(/[a-z]+/g);
        const name = names.shift();
        const type = line[0];

        return {
            name,
            type,
            targets: names,
            on: false,
            inputSources: [],
            inputs: [],
        };
    });

    circuits.forEach((c) => {
        if (c.type === "&") {
            const ins = circuits.filter((c1) => c1.targets.includes(c.name));
            ins.forEach((cin) => c.inputs.push([cin.name, 0]));
        }
    });
    return circuits;
}
