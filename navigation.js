// Module 1 user interface (dropdowns, SVG map, route display)
(function () {
    "use strict";
    const NS = "http://www.w3.org/2000/svg";
    const $ = id => document.getElementById(id);
    const adj = buildAdjacency(CAMPUS_NODES, CAMPUS_EDGES, false);
    const byId = new Map(CAMPUS_NODES.map(n => [n.id, n]));
    const fromSel = $("nav-from"), toSel = $("nav-to"), closedSel = $("nav-closed");
    const result = $("nav-result"), svg = $("nav-svg");
    const edgeEls = new Map(), nodeEls = new Map();
    const DEFAULT_MSG = "Choose a start and a destination, then select Find Route.";
    const edgeKey = (a, b) => (a < b ? a + "|" + b : b + "|" + a);
    const label = id => byId.get(id).label;

    function svgEl(tag, attrs) {
        const el = document.createElementNS(NS, tag);
        for (const k in attrs) el.setAttribute(k, attrs[k]);
        return el;
    }

    // Build dropdowns
    const sorted = CAMPUS_NODES.slice().sort((a, b) => a.label.localeCompare(b.label));
    function fillSelect(sel, firstText) {
        sel.appendChild(new Option(firstText, ""));
        sorted.forEach(n => sel.appendChild(new Option(n.label, n.id)));
    }
    fillSelect(fromSel, "Select start");
    fillSelect(toSel, "Select destination");
    fillSelect(closedSel, "None (all locations open)");

    // Draw map (edges first so nodes sit on top)
    CAMPUS_EDGES.forEach(e => {
        const a = byId.get(e.from), b = byId.get(e.to);
        const line = svgEl("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "edge " + e.type });
        svg.appendChild(line);
        edgeEls.set(edgeKey(e.from, e.to), line);
    });
    CAMPUS_NODES.forEach(n => {
        const g = svgEl("g", { class: "node" });
        const title = svgEl("title", {});
        title.textContent = n.label;
        const text = svgEl("text", { x: n.x, y: n.y + 20 });
        text.textContent = n.short;
        g.append(title, svgEl("circle", { cx: n.x, cy: n.y, r: 8 }), text);
        g.addEventListener("click", () => pickFromMap(n.id));
        svg.appendChild(g);
        nodeEls.set(n.id, g);
    });

    const unverified = CAMPUS_EDGES.filter(e => !e.verified).length;
    $("nav-notice").textContent =
        "Sample data: every path has weight 1, so routes minimise the number of hops. These are not measured distances. " +
        unverified + " of " + CAMPUS_EDGES.length + " paths are still unverified.";

    function show(msg, kind) { result.className = "nav-result " + kind; result.textContent = msg; }
    function clearHighlight() {
        svg.classList.remove("has-route");
        edgeEls.forEach(el => el.classList.remove("on-path"));
        nodeEls.forEach(el => el.classList.remove("on-path", "start", "end"));
    }
    function markClosed() {
        nodeEls.forEach((el, id) => el.classList.toggle("closed", id === closedSel.value));
    }

    function findRoute() {
        clearHighlight();
        const s = fromSel.value, t = toSel.value, c = closedSel.value;
        if (!s || !t) return show("Select both a start and a destination.", "error");
        if (!byId.has(s) || !byId.has(t)) return show("That location is not on the campus graph.", "error");
        const blocked = new Set(c ? [c] : []);
        if (blocked.has(s) || blocked.has(t)) return show("The start or destination is closed. Reopen it or choose another location.", "error");
        if (s === t) {
            nodeEls.get(s).classList.add("start", "end");
            return show("Start and destination are the same location.\nTotal weight: 0", "ok");
        }
        const r = dijkstra(adj, s, t, blocked);
        if (!r.found) {
            return show("No route exists from " + label(s) + " to " + label(t) +
                (c ? " while " + label(c) + " is closed." : "."), "error");
        }
        svg.classList.add("has-route");
        r.path.forEach((id, i) => {
            nodeEls.get(id).classList.add("on-path");
            if (i > 0) edgeEls.get(edgeKey(r.path[i - 1], id)).classList.add("on-path");
        });
        nodeEls.get(s).classList.add("start");
        nodeEls.get(t).classList.add("end");
        show("Route (" + r.path.length + " locations):\n" + r.path.map(label).join(" → ") +
            "\nTotal weight: " + r.distance + " (sample unit weights)", "ok");
    }

    // Clicking a map node fills Start, then Destination, then starts over.
    function pickFromMap(id) {
        if (!fromSel.value || toSel.value) { fromSel.value = id; toSel.value = ""; clearHighlight(); show(DEFAULT_MSG, "info"); }
        else { toSel.value = id; findRoute(); }
    }

    function reset() {
        fromSel.value = toSel.value = closedSel.value = "";
        clearHighlight(); markClosed(); show(DEFAULT_MSG, "info");
    }

    $("nav-find").addEventListener("click", findRoute);
    $("nav-reset").addEventListener("click", reset);
    closedSel.addEventListener("change", () => { markClosed(); clearHighlight(); show(DEFAULT_MSG, "info"); });
    show(DEFAULT_MSG, "info");
})();