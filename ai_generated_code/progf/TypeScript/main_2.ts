function readInput(file_path: string, height: number, width: number) {
    const bytes = Deno.readTextFileSync(file_path).split('\n').map((line) => {
      const [x,y] = line.split(',')
      return {x: parseInt(x), y: parseInt(y)}
    })
    const space = Array.from({length: height}, () => Array(width).fill('.'))
    return {bytes, space}
}

export function solvePartOne(file_path: string, height: number, width: number, num_bytes: number) {
    const {bytes, space} = readInput(file_path, height, width)
    for (let i = 0; i < num_bytes; i++) {
        const {x, y} = bytes[i]
        space[y][x] = '#'
    }
    printSpace(space)
   return findShortestPath(space)
}

function printSpace(space: string[][]) {
    console.log(space.map((row) => row.join('')).join('\n'))
}

// Thanks ChatGPT :D
function findShortestPath(space: string[][]) {
    const height = space.length;
    const width = space[0].length;
    const start = { x: 0, y: 0, steps: 0, cost: 0 };
    const queue = [start];
    const visited = Array.from({ length: height }, () => Array(width).fill(false));

    const heuristic = (x: number, y: number) => Math.abs(x - (width - 1)) + Math.abs(y - (height - 1));

    while (queue.length > 0) {
        queue.sort((a, b) => (a.steps + a.cost) - (b.steps + b.cost));
        const { x, y, steps } = queue.shift() || { x: NaN, y: NaN, steps: NaN};
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
export function solvePartTwo(file_path: string, height: number, width: number) {
    const {bytes, space} = readInput(file_path, height, width)
    for (let i = 0; i < bytes.length; i++) {
        const {x, y} = bytes[i]
        space[y][x] = '#'
        console.log(`Progress: ${i + 1}/${bytes.length}`)
        if (findShortestPath(space) === -1) return `${x},${y}`
    }
    throw new Error('No blocking byte found')
}

console.log(`
Part One: ${solvePartOne('input.txt', 71, 71, 1024)}
Part Two: ${solvePartTwo('input.txt', 71, 71)}
`)
