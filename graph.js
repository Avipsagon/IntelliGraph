// Binary min-heap of [key, value] pairs. push/pop are O(log n).
class MinHeap {
    constructor() { this.a = []; }
    size() { return this.a.length; }
    push(key, val) {
        const a = this.a;
        a.push([key, val]);
        let i = a.length - 1;
        while (i > 0) {                       // sift up
            const p = (i - 1) >> 1;
            if (a[p][0] <= a[i][0]) break;
            [a[p], a[i]] = [a[i], a[p]];
            i = p;
        }
    }
    pop() {
        const a = this.a, top = a[0], last = a.pop();
        if (a.length) {
            a[0] = last;
            let i = 0;
            for (;;) {                        // sift down
                const l = 2 * i + 1, r = l + 1;
                let s = i;
                if (l < a.length && a[l][0] < a[s][0]) s = l;
                if (r < a.length && a[r][0] < a[s][0]) s = r;
                if (s === i) break;
                [a[s], a[i]] = [a[i], a[s]];
                i = s;
            }
        }
        return top;
    }
}

// Adjacency list: Map<nodeId, [{to, weight, type}]>. Space O(V + E).
// Undirected graphs store each edge in both directions.
function buildAdjacency(nodes, edges, directed) {
    const adj = new Map(nodes.map(n => [n.id, []]));
    for (const e of edges) {
        if (!adj.has(e.from) || !adj.has(e.to)) throw new Error("Edge uses unknown node: " + e.from + " - " + e.to);
        if (e.weight < 0) throw new Error("Dijkstra requires non-negative weights.");
        adj.get(e.from).push({ to: e.to, weight: e.weight, type: e.type });
        if (!directed) adj.get(e.to).push({ to: e.from, weight: e.weight, type: e.type });
    }
    return adj;
}