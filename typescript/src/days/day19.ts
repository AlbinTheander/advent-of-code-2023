type Rule =
    | {
          op: "=";
          target: string;
      }
    | {
          op: "<" | ">";
          prop: string;
          num: number;
          target: string;
      };

type Workflow = {
    name: string;
    rules: Rule[];
};

type Part = {
    x: number;
    m: number;
    a: number;
    s: number;
    total: number;
};

export function day19(data: string) {
    const [parts, workflows] = parseData(data);
    part1(parts, workflows);
    part2(workflows);
}

function part1(parts: Part[], workflows: Workflow[]) {
    let sum = 0;
    for (const part of parts) {
        let wName = "in";
        while (!"AR".includes(wName)) {
            const wflow = workflows.find((w) => w.name === wName);
            wName = applyWF(wflow, part);
        }
        if (wName === "A") sum += part.total;
    }
    console.log(sum);
}

function applyWF(workflow: Workflow, part: Part): string {
    for (const rule of workflow.rules) {
        switch (rule.op) {
            case "=":
                return rule.target;
            case "<":
                if (part[rule.prop] < rule.num) return rule.target;
                break;
            case ">":
                if (part[rule.prop] > rule.num) return rule.target;
                break;
        }
    }
    return "PANIK";
}

type Range = [number, number];
type PartRange = { x: Range; m: Range; a: Range; s: Range };

function part2(workflows: Workflow[]) {
    const toSearch = [
        {
            wName: "in",
            range: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] },
        },
    ];
    let total = 0;
    while (toSearch.length > 0) {
        console.log('Playing with', toSearch.at(-1))
        let { wName, range } = toSearch.pop();
        if (wName === 'A') {
            console.log('Accepting', range);
            total +=
                (range.x[1] - range.x[0] + 1) *
                (range.m[1] - range.m[0] + 1) *
                (range.a[1] - range.a[0] + 1) *
                (range.s[1] - range.s[0] + 1);
            continue;
        }
        if (wName === 'R') {
            console.log('Rejecting', range);
            continue;
        }
        const workflow = workflows.find((w) => w.name === wName);
        for (const rule of workflow.rules) {
            if (rule.op === "<") {
                const min = range[rule.prop][0];
                const max = Math.min(range[rule.prop][1], rule.num - 1);
                if (min <= max) {
                    const newRange = { ...range, [rule.prop]: [min, max] };
                    console.log("Will check", rule.target, "with", newRange);
                    toSearch.push({wName: rule.target, range: newRange });
                }
                const restMin = Math.max(range[rule.prop][0], rule.num);
                const restMax = range[rule.prop][1];
                if (restMin <= restMax) {
                    range = { ...range, [rule.prop]: [restMin, restMax] };
                    console.log("continue with", range);
                }
            }
            if (rule.op === ">") {
                const min = Math.max(range[rule.prop][0], rule.num + 1);
                const max = range[rule.prop][1];
                if (min <= max) {
                    const newRange = { ...range, [rule.prop]: [min, max] };
                    console.log("Will check", rule.target, "with", newRange);
                    toSearch.push({wName: rule.target, range: newRange });
                }
                const restMin = range[rule.prop][0];
                const restMax = Math.min(range[rule.prop][1], rule.num);
                if (restMin <= restMax) {
                    range = { ...range, [rule.prop]: [restMin, restMax] };
                    console.log("continue with", range);
                }
            }
            if (rule.op === "=") {
                console.log("Will next check", rule.target, "with", range);
                toSearch.push({ wName: rule.target, range: range })
            }
        }
    }
    console.log(total);
}

function parseData(data: string): [Part[], Workflow[]] {
    const [workflowPart, partPart] = data.split("\n\n");

    // px{a<2006:qkq,m>2090:A,rfg}
    const workflows = workflowPart.split("\n").map((line) => {
        const [name, rulePart] = line.match(/[^{}]+/g);
        const rules: Rule[] = rulePart.split(",").map((r) => {
            if (r.includes(":")) {
                const [condition, target] = r.split(":");
                const prop = condition[0];
                const op = condition[1] as "<" | ">";
                const num = +condition.slice(2);
                return { prop, op, num, target };
            }
            return { op: "=", target: r };
        });
        return { name, rules };
    });

    const parts = partPart.split("\n").map((line) => {
        const [x, m, a, s] = line.match(/\d+/g).map(Number);
        return { x, m, a, s, total: x + m + a + s };
    });

    return [parts, workflows];
}
