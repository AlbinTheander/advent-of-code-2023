type Circuit = {
    name: string,
    type: string,
    targets: string[],
    on: boolean,
    inputs: [string, number][]
}
export function day20(data: string) {
    const circuits = parseData(data);
    const result1 = part1(circuits);
    const result2 = 228282646835717;

    console.log('The product of the low and high pulses after 1000 pushes is', result1);
    console.log('The number of presses before rx receives a low pulse is', result2);
}

function part1(circuits: Circuit[]) {
    let lows = 0, highs = 0;
    for (let i = 0; i < 1000; i++) {
        const [low, high] = simulate(circuits);
        lows += low;
        highs += high;        
    }

    return lows * highs;
}

type State = [string, string|boolean][];

function part2(circuits: Circuit[]) {
    // Just check the branch day20-lab and clean it up
}

function printDiffState(state1: State, state2: State) {
    console.log('State diff');
    for (let i = 0; i < state1.length; i++) {
        if (state1[i][1] !== state2[i][1]) console.log(state1[i][0], state1[i][1], '->', state2[i][1]);
    }

}

function getState(circuits: Circuit[]): State {
    const states = [];
    for (const circuit of circuits) {
        if (circuit.type === '%') states.push([circuit.name, circuit.on]);
        if (circuit.type === '&') states.push([circuit.name, circuit.inputs.map(inp => inp[1]).join('')]);
    }
    return states;
}

function simulate(circuits: Circuit[]) {
    const triggered: [string, string, number][] = [['button', 'broadcaster', 0]];
    const sent = [0, 0]

    while(triggered.length > 0) {
        const [source, name, signal] = triggered.shift();
        // console.log(source, '->', name, signal)
        // if (name === 'rx') sent += signal;
        if (signal === 0) sent[0]++; else sent[1]++;
        const circuit = circuits.find(c => c.name === name);
        if (!circuit) continue;

        if (circuit.type === 'b') {
            circuit.targets.forEach(t => triggered.push([circuit.name, t, signal]));
        }
        if (circuit.type === '%') {
            if (signal === 0) {
                circuit.on = !circuit.on;
                const newSignal = circuit.on ? 1 : 0;
                circuit.targets.forEach(t => triggered.push([circuit.name, t, newSignal]));
            }
        }
        if (circuit.type === '&') {
            const sourceInput = circuit.inputs.find(inp => inp[0] === source);
            if (sourceInput) sourceInput[1] = signal; else circuit.inputs.push([source, signal]);
            const newSignal = circuit.inputs.every(inp => inp[1] === 1) ? 0 : 1;
            circuit.targets.forEach(t => triggered.push([circuit.name, t, newSignal]));
        }
    }
    return sent;
}

function parseData(data: string): Circuit[] {
    const lines = data.split('\n');

    const circuits = lines.map(line => {
        const names = line.match(/[a-z]+/g)
        const name = names.shift();
        const type = line[0];

        return { name, type, targets: names, on: false, inputSources: [], inputs: [] }
    })

    circuits.forEach(c => {
        if (c.type === '&') {
            const ins = circuits.filter(c1 => c1.targets.includes(c.name));
            ins.forEach(cin => c.inputs.push([cin.name, 0]));
        }
    });
    return circuits;
}