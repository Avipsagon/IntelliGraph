// Dijkstra's shortest path. Time O((V + E) log V), space O(V + E). Non-negative weights only.
// blocked: optional Set of node ids that cannot be used (closed locations).
function dijkstra(adj, source, target, blocked) {
    blocked = blocked || new Set();
    const dist = new Map(), prev = new Map(), done = new Set(), heap = new MinHeap();
    for (const id of adj.keys()) dist.set(id, Infinity);
    dist.set(source, 0);
    heap.push(0, source);

    while (heap.size() > 0) {
        const [d, u] = heap.pop();
        if (done.has(u)) continue;            // stale heap entry
        done.add(u);
        if (u === target) break;              // target's distance is now final
        for (const edge of adj.get(u)) {
            if (blocked.has(edge.to)) continue;
            const nd = d + edge.weight;       // relaxation step
            if (nd < dist.get(edge.to)) {
                dist.set(edge.to, nd);
                prev.set(edge.to, u);
                heap.push(nd, edge.to);
            }
        }
    }

    if (dist.get(target) === Infinity) return { found: false };
    const path = [];
    for (let v = target; v !== undefined; v = prev.get(v)) path.push(v);
    return { found: true, path: path.reverse(), distance: dist.get(target) };
}