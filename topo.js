// Kahn's algorithm + cycle extraction. Time O(V + E), space O(V + E).
// ids: topic ids in insertion order. edges: [{from, to}] meaning "from" is studied before "to".
function topologicalSort(ids, edges) {
    const indeg = new Map(ids.map(i => [i, 0]));
    const out = new Map(ids.map(i => [i, []]));
    const pred = new Map(ids.map(i => [i, []]));
    for (const e of edges) {
        out.get(e.from).push(e.to);
        pred.get(e.to).push(e.from);
        indeg.set(e.to, indeg.get(e.to) + 1);
    }

    const queue = ids.filter(i => indeg.get(i) === 0), order = [];
    for (let head = 0; head < queue.length; head++) {
        const u = queue[head];
        order.push(u);
        for (const v of out.get(u)) {
            indeg.set(v, indeg.get(v) - 1);   // "remove" edge u -> v
            if (indeg.get(v) === 0) queue.push(v);
        }
    }
    if (order.length === ids.length) return { ok: true, order };

    // Fewer than V topics were output, so a cycle exists. Walk backwards to find it.
    const done = new Set(order), remaining = new Set(ids.filter(i => !done.has(i)));
    const seen = new Map(), path = [];
    let v = [...remaining][0];
    while (!seen.has(v)) {
        seen.set(v, path.length);
        path.push(v);
        v = pred.get(v).find(p => remaining.has(p));
    }
    const cycle = path.slice(seen.get(v)).reverse();
    cycle.push(cycle[0]);
    return { ok: false, order, cycle };
}