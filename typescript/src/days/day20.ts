type Circuit = {
    name: string;
    type: string;
    targets: string[];
    on: boolean;
    inputs: [string, number][];
};
export function day20(data: string) {
    const circuits = parseData(data);
    // part1(circuits);
    part2(circuits);
}

function part1(circuits: Circuit[]) {
    let lows = 0,
        highs = 0;
    for (let i = 0; i < 1000; i++) {
        console.log('\nRound', i)
        const [low, high] = simulate(circuits);
        lows += low;
        highs += high;
    }

    console.log("Result part 1", lows * highs);
}

type State = [string, string | boolean][];

function part2(circuits: Circuit[]) {
    const checked = new Set<string>();
    const mq = circuits.find((c) => c.name === "mq");
    console.log(mq);
    let next = 0;
    for (let i = 1; i < 100000; i++) {
        const [low, high] = simulate(circuits);
        const result = mq.inputs.map((inp) => inp[1]).join("");
        const ones = mq.inputs.filter(inp => inp[1] === 1).length;
        if (ones === 1 && !checked.has(result)) {
            console.log(i, result);
            checked.add(result);
            next += i;
        }
    }
    console.log(mq);
    console.log(next);
}

function printDiffState(state1: State, state2: State) {
    console.log("State diff");
    for (let i = 0; i < state1.length; i++) {
        if (state1[i][1] !== state2[i][1])
            console.log(state1[i][0], state1[i][1], "->", state2[i][1]);
    }
}

function getState(circuits: Circuit[]): State {
    const states = [];
    for (const circuit of circuits) {
        if (circuit.type === "%") states.push([circuit.name, circuit.on]);
        if (circuit.type === "&")
            states.push([
                circuit.name,
                circuit.inputs.map((inp) => inp[1]).join(""),
            ]);
    }
    return states;
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
                if (signal === 0) sent[0]++; else sent[1]++;
                // console.log('Sending', source, '->', signal, '->', targetId)
                const target = circuits.find((c) => c.name === targetId);
                if (!target) continue;
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
                        const newSignal = target.inputs.every(inp => inp[1] === 1) ? 0 : 1;
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
