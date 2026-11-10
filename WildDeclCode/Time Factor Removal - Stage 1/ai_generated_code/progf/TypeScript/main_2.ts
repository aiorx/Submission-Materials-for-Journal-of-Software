function readInput(file_path: string, height: number, width: number) {
    const bytes = Deno.readTextFileSync(file_path).split('\n').map(function (line) {
      const [x,y] = line.split(',')
      return {x: parseInt(x), y: parseInt(y)}
    })
    const space = Array.from({length: height}, function () { return Array(width).fill('.'); })
    return {bytes, space}
}

function solvePartOne(file_path: string, height: number, width: number, num_bytes: number) {
    var bytes = readInput.bytes;
var space = readInput.space;(file_path, height, width)
    for (let i = 0; i < num_bytes; i++) {
        var x = bytes.x;
var y = bytes.y;[i]
        space[y][x] = '#'
    }
    printSpace(space)
   return findShortestPath(space)
}

function printSpace(space: string[][]) {
    console.log(space.map(function (row) { return row.join(''); }).join('\n'))
}

// Thanks ChatGPT :D
function findShortestPath(space: string[][]) {
    const height = space.length;
    const width = space[0].length;
    const start = { x: 0, y: 0, steps: 0, cost: 0 };
    const queue = [start];
    const visited = Array.from({ length: height }, function () { return Array(width).fill(false); });

    const heuristic = function (x: number, y: number) { return Math.abs(x - (width - 1)) + Math.abs(y - (height - 1)); };

    while (queue.length > 0) {
        queue.sort(function (a, b) { return (a.steps + a.cost) - (b.steps + b.cost); });
        var x = queue.shift.x;
var y = queue.shift.y;
var steps = queue.shift.steps;() || { x: NaN, y: NaN, steps: NaN};
        if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x] || space[y][x] === '#') {
            continue;
        }
        visited[y][x] = true;
        if (x === width - 1 && y === height - 1) {
            return steps;
        }
        const cost = heuristic(x, y);
        queue.push({ x: x + 1, y, steps: steps + 1, cost });
        queue.push({ x: x - 1, y, steps: steps + 1, cost });
        queue.push({ x, y: y + 1, steps: steps + 1, cost });
        queue.push({ x, y: y - 1, steps: steps + 1, cost });
    }
    return -1;
}

// Very slow, but works
function solvePartTwo(file_path: string, height: number, width: number) {
    var bytes = readInput.bytes;
var space = readInput.space;(file_path, height, width)
    for (let i = 0; i < bytes.length; i++) {
        var x = bytes.x;
var y = bytes.y;[i]
        space[y][x] = '#'
        console.log("Progress: " + (i + 1) + "/" + (bytes.length) + "")
        if (findShortestPath(space) === -1) return "" + (x) + "," + (y) + ""
    }
    throw new Error('No blocking byte found')
}

console.log("
Part One: " + (solvePartOne('input.txt', 71, 71, 1024)) + "
Part Two: " + (solvePartTwo('input.txt', 71, 71)) + "
")
