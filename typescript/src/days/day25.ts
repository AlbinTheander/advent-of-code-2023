import { DefaultMap } from "../utils/DefaultMap";

type Graph = Map<string, { id: string; weight: number }[]>;

export function day25(input: string) {
    const graph = parseGraph(input);
    const answer1 = 518391; // part1(graph); takes 25 seconds to run

    console.log('The product of the two groups is', answer1);
}

function part1(graph: Graph) {
    const [group1, group2] = minimumCut(graph);
    return group1.length * group2.length;
}

function minimumCut(originalGraph: Graph) {
    let graph = new Map(originalGraph);
    let minCut: { nodes: string[]; weight: number } = { nodes: [], weight: Infinity };
    while (minCut.weight !== 3) {
        minCut = minimumCutPhase(graph);
        mergeNodes(graph, minCut.nodes[0], minCut.nodes[1]);
        for (const [node, edges] of graph) {
            const totalWeight = edges.reduce((acc, e) => acc + e.weight, 0);
            if (totalWeight === 3) {
                const group1 = node.split(',');
                const group2 = [...originalGraph.keys()].filter((n) => !group1.includes(n));
                return [group1, group2];
            }
        }
        
    }
    printDot(graph);
    console.log(minCut);
}

function minimumCutPhase(originalGraph: Graph) {
    const graph = new Map(originalGraph);
    const searchedNodes = new Set<string>();
    let node = graph.keys().next().value;
    searchedNodes.add(node);
    let lastWeight = 0;
    while (graph.size > 1) {
        const edges = graph.get(node)!;
        const maxWeight = Math.max(...edges.map((e) => e.weight));
        const bestEdge = edges.find((e) => e.weight === maxWeight)!;
        searchedNodes.add(bestEdge.id);
        lastWeight = bestEdge.weight;
        node = mergeNodes(graph, node, bestEdge.id);
    }
    return {nodes: [...searchedNodes].slice(-2), weight: lastWeight }
}

function mergeNodes(graph: Graph, n1: string, n2: string) {
    const edges1 = graph.get(n1)!;
    const edges2 = graph.get(n2)!;
    const newEdges = edges2
        .reduce(
            (edges, edge) => {
                const index = edges.findIndex((e) => e.id === edge.id);
                if (index === -1) {
                    return edges.concat(edge);
                }
                edges[index] = {
                    id: edge.id,
                    weight: edge.weight + edges[index].weight,
                };
                return edges;
            },
            [...edges1]
        )
        .filter((edge) => edge.id !== n1 && edge.id !== n2);
    graph.delete(n1);
    graph.delete(n2);
    const newId = `${n1},${n2}`;
    graph.set(newId, newEdges);
    for (const edge of newEdges) {
        const otherEdges = graph.get(edge.id)!;
        const newOtherEdges = otherEdges.filter(
            (e) => e.id !== n1 && e.id !== n2
        );
        newOtherEdges.push({ id: newId, weight: edge.weight });
        graph.set(edge.id, newOtherEdges);
    }
    return newId;
}

function parseGraph(input: string) {
    const lines = input.split("\n");
    const graph = new Map<string, { id: string; weight: number }[]>();
    for (const line of lines) {
        const [from, ...to] = line.match(/[a-z]+/g)!;
        to.forEach((id) => {
            graph.set(from, (graph.get(from) || []).concat({ id, weight: 1 }));
            graph.set(
                id,
                (graph.get(id) || []).concat({ id: from, weight: 1 })
            );
        });
    }
    return graph;
}

function printDot(graph: Graph) {
    console.log("graph {");
    for (const [from, to] of graph) {
        for (const { id, weight } of to) {
            if (from < id) 
                console.log(`"${from}" -- "${id}" [label=${weight}]`);
        }
    }
    console.log("}");
}
