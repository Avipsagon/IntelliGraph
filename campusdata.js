// SAMPLE DATA: every weight is UNIT_WEIGHT (1) until real distances are measured.
// To use a real distance, add it as the 5th value of an edge, e.g. ['gate3','c','path',0,120].
const UNIT_WEIGHT = 1;

// [id, label, x, y, shortLabelForMap]
const CAMPUS_NODES = [
    ['gate3','Gate 3',50,40], ['wfc','West Food Court',50,150], ['manchw','Manch (West)',50,250],
    ['c','C Block',130,80], ['b','B Block',180,200], ['a','A Block',180,300],
    ['cl','Central Lawn',300,190], ['f','F Block',400,90], ['e','E Block',520,50],
    ['bunkyard','Bunkyard',520,160], ['svl','Swami Vivekanand Library',400,300,'Vivekanand Library'],
    ['l','L Block',360,400], ['k','K Block',260,420], ['g','G Block',130,440],
    ['fs','Food Street (incl. Chai Garam)',390,500,'Food Street'], ['gate6','Gate 6',50,540],
    ['m','M Block',540,340], ['mw','Mechanical Workshop',600,250], ['medical','Medical Room',700,230],
    ['n','N Block',620,430], ['bh2','Boys Hostel 2',700,470], ['bh1','Boys Hostel 1',740,400],
    ['red','Red Brick',700,330], ['h','H Block',360,570], ['i','I Block',480,570], ['j','J Block',600,570],
    ['q','Q Block',790,320], ['sports','Sports Arena & Open Gym',900,290,'Sports Arena'],
    ['girls','Girls Hostel',1020,290], ['nescafe','Nescafe (near Q)',900,370],
    ['t','T Block',790,510], ['opb','OP Bhalla Library',920,590], ['wh','WH Smith',920,520],
    ['manche','Manch (East)',880,450], ['parking','Parking Lot',990,450], ['gate7','Gate 7',700,610]
].map(([id, label, x, y, short]) => ({ id, label, x, y, short: short || label }));

// [from, to, type ('s' stairs, 'r' ramp, else path), unverified (1 = still marked "?"), optional weight]
const CAMPUS_EDGES = [
    ['gate3','c'], ['gate3','wfc'], ['wfc','manchw'], ['manchw','b','p',1], ['a','b'], ['b','c'],
    ['e','f'], ['f','bunkyard'], ['bunkyard','e'], ['b','f','p',1],
    ['bunkyard','svl','s'], ['bunkyard','fs','s'], ['c','g','r'], ['cl','g','r'],
    ['svl','l'], ['l','k'], ['k','g'], ['fs','l'], ['fs','k'], ['fs','g','p',1], ['g','gate6'],
    ['svl','m','p',1], ['m','mw'], ['mw','medical'], ['m','n'], ['n','bh2'], ['bh2','bh1'], ['bh1','red'],
    ['gate6','h','p',1], ['h','i'], ['i','j'], ['j','red'], ['k','h','p',1],
    ['red','q','p',1], ['q','sports'], ['q','nescafe'], ['sports','girls'],
    ['j','t'], ['t','opb'], ['t','wh'], ['t','manche'], ['manche','parking'], ['t','gate7'],
    ['j','gate7','p',1], ['t','q','p',1],
    ['cl','b'], ['cl','c'], ['cl','f']
].map(([from, to, type, unverified, w]) => ({
    from, to,
    type: { s: 'stairs', r: 'ramp' }[type] || 'path',
    verified: !unverified,
    weight: w === undefined ? UNIT_WEIGHT : w
}));