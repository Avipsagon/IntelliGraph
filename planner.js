// Module 2 user interface (topics, prerequisites, graph drawing, study order)
(function () {
    "use strict";
    const NS = "http://www.w3.org/2000/svg";
    const $ = id => document.getElementById(id);
    const input = $("plan-topic"), preSel = $("plan-pre"), postSel = $("plan-post");
    const svg = $("plan-svg"), box = $("plan-message");
    const DEFAULT_MSG = "Add topics, link prerequisites, then select Generate Order.";
    let topics = [], links = [], nextId = 1;
    const nameOf = id => topics.find(t => t.id === id).name;

    function svgEl(tag, attrs, text) {
        const el = document.createElementNS(NS, tag);
        for (const k in attrs) el.setAttribute(k, attrs[k]);
        if (text) el.textContent = text;
        return el;
    }
    function msg(text, kind) { box.className = "nav-result " + kind; box.textContent = text; }

    // Data operations
    function addTopic() {
        const name = input.value.trim().replace(/\s+/g, " ");
        if (!name) return msg("Enter a topic name first.", "error");
        if (topics.some(t => t.name.toLowerCase() === name.toLowerCase())) return msg("That topic already exists.", "error");
        topics.push({ id: "t" + nextId++, name });
        input.value = "";
        refresh();
        msg('Added "' + name + '".', "info");
    }
    function addLink() {
        const from = preSel.value, to = postSel.value;
        if (!from || !to) return msg("Select both a prerequisite and the topic that depends on it.", "error");
        if (from === to) return msg("A topic cannot be its own prerequisite.", "error");
        if (links.some(l => l.from === from && l.to === to)) return msg("That prerequisite already exists.", "error");
        links.push({ from, to });
        refresh();
        msg(nameOf(from) + " → " + nameOf(to) + " added.", "info");
    }
    function removeTopic(id) {
        topics = topics.filter(t => t.id !== id);
        links = links.filter(l => l.from !== id && l.to !== id);
        refresh();
        msg("Topic removed along with its prerequisites.", "info");
    }
    function removeLink(i) { links.splice(i, 1); refresh(); msg("Prerequisite removed.", "info"); }
    function reset() { topics = []; links = []; nextId = 1; input.value = ""; refresh(); msg(DEFAULT_MSG, "info"); }

    function loadSample() {
        reset();
        ["Logic", "Sets", "Relations", "Functions", "Graph Theory", "Trees", "Shortest Paths"]
            .forEach(n => topics.push({ id: "t" + nextId++, name: n }));
        const id = n => topics.find(t => t.name === n).id;
        [["Logic", "Sets"], ["Sets", "Relations"], ["Sets", "Functions"], ["Relations", "Graph Theory"],
         ["Functions", "Graph Theory"], ["Graph Theory", "Trees"], ["Graph Theory", "Shortest Paths"]]
            .forEach(([a, b]) => links.push({ from: id(a), to: id(b) }));
        refresh();
        msg("Sample topics loaded (example data). Select Generate Order.", "info");
    }

    function generate() {
        if (!topics.length) return msg("Add at least one topic first.", "error");
        const r = topologicalSort(topics.map(t => t.id), links);
        if (r.ok) {
            draw(r.order);
            msg("Valid study order:\n" + r.order.map((id, i) => (i + 1) + ". " + nameOf(id)).join("\n") +
                "\n\nSeveral valid orders can exist. Ties are broken by the order topics were added.", "ok");
        } else {
            draw(null, r.cycle);
            msg("No valid study order: circular prerequisites found.\n" + r.cycle.map(nameOf).join(" → ") +
                "\n\nRemove one of these prerequisites and try again.", "error");
        }
    }

    // Rendering
    function fillSelect(sel, first) {
        const keep = sel.value;
        sel.replaceChildren(new Option(first, ""));
        topics.forEach(t => sel.appendChild(new Option(t.name, t.id)));
        if (topics.some(t => t.id === keep)) sel.value = keep;
    }
    function xButton(label, handler) {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = "×"; b.setAttribute("aria-label", label); b.onclick = handler;
        return b;
    }
    function refresh() {
        fillSelect(preSel, "Select prerequisite");
        fillSelect(postSel, "Select topic");
        const chips = $("plan-topics"), list = $("plan-edges");
        chips.replaceChildren(); list.replaceChildren();
        if (!topics.length) chips.textContent = "No topics yet.";
        topics.forEach(t => {
            const c = document.createElement("span");
            c.className = "chip";
            c.append(t.name, xButton("Remove topic " + t.name, () => removeTopic(t.id)));
            chips.appendChild(c);
        });
        if (!links.length) list.textContent = "No prerequisites yet.";
        links.forEach((l, i) => {
            const li = document.createElement("li");
            li.append(nameOf(l.from) + " → " + nameOf(l.to),
                xButton("Remove prerequisite " + nameOf(l.from) + " to " + nameOf(l.to), () => removeLink(i)));
            list.appendChild(li);
        });
        draw();
    }

    // Layered layout: a topic's column = length of the longest prerequisite chain before it.
    function draw(order, cycle) {
        svg.replaceChildren();
        if (!topics.length) {
            svg.setAttribute("viewBox", "0 0 600 240");
            svg.appendChild(svgEl("text", { x: 300, y: 120, class: "plan-empty" }, "Add topics to build the prerequisite graph."));
            return;
        }
        const n = topics.length, layer = new Map(topics.map(t => [t.id, 0]));
        for (let k = 0; k < n; k++)
            for (const l of links) layer.set(l.to, Math.min(n - 1, Math.max(layer.get(l.to), layer.get(l.from) + 1)));
        const cols = [];
        topics.forEach(t => { const L = layer.get(t.id); (cols[L] = cols[L] || []).push(t.id); });
        const maxCount = Math.max(...cols.filter(Boolean).map(c => c.length));
        const pos = new Map();
        cols.forEach((col, L) => col && col.forEach((id, i) => pos.set(id, { x: 95 + L * 190, y: 40 + i * 64 })));
        svg.setAttribute("viewBox", "0 0 " + cols.length * 190 + " " + (maxCount * 64 + 16));

        const cycNodes = new Set(cycle || []), cycEdges = new Set();
        (cycle || []).forEach((id, i) => { if (i > 0) cycEdges.add(cycle[i - 1] + ">" + id); });

        const defs = svgEl("defs", {});
        [["arrow", "arrow"], ["arrow-cyc", "arrow-cyc"]].forEach(([id, cls]) => {
            const m = svgEl("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
            m.appendChild(svgEl("path", { d: "M0 0L10 5L0 10z", class: cls }));
            defs.appendChild(m);
        });
        svg.appendChild(defs);

        links.forEach(l => {
            const a = pos.get(l.from), b = pos.get(l.to);
            const dx = b.x - a.x, dy = b.y - a.y;
            const t = Math.min(67 / (Math.abs(dx) || 1e-9), 19 / (Math.abs(dy) || 1e-9)); // trim to box edge
            const bad = cycEdges.has(l.from + ">" + l.to);
            svg.appendChild(svgEl("line", {
                x1: a.x + dx * t, y1: a.y + dy * t, x2: b.x - dx * t, y2: b.y - dy * t,
                class: "pedge" + (bad ? " cyc" : ""), "marker-end": "url(#" + (bad ? "arrow-cyc" : "arrow") + ")"
            }));
        });
        topics.forEach(t => {
            const p = pos.get(t.id), g = svgEl("g", { class: "pnode" + (cycNodes.has(t.id) ? " cyc" : "") });
            g.append(svgEl("title", {}, t.name),
                svgEl("rect", { x: p.x - 65, y: p.y - 17, width: 130, height: 34, rx: 8 }),
                svgEl("text", { x: p.x, y: p.y }, t.name.length > 18 ? t.name.slice(0, 17) + "…" : t.name));
            if (order) g.append(svgEl("circle", { cx: p.x - 65, cy: p.y - 17, r: 11, class: "badge" }),
                svgEl("text", { x: p.x - 65, y: p.y - 17, class: "badge-num" }, order.indexOf(t.id) + 1));
            svg.appendChild(g);
        });
    }

    $("plan-add").addEventListener("click", addTopic);
    input.addEventListener("keydown", e => { if (e.key === "Enter") addTopic(); });
    $("plan-link").addEventListener("click", addLink);
    $("plan-sort").addEventListener("click", generate);
    $("plan-sample").addEventListener("click", loadSample);
    $("plan-reset").addEventListener("click", reset);
    refresh();
    msg(DEFAULT_MSG, "info");
})();