import { readFileSync } from "fs"

const input = readFileSync("./Day8/input.txt", "utf-8")

let lines = input.split("\r\n")
const map = ParseMap(lines)
console.log(countVisibleTrees(map))

function ParseMap(lines: string[]) {
	let map: number[][] = []
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i]
		let row: number[] = []
		for (let j = 0; j < line.length; j++) {
			row.push(Number(line[j]))
		}
		map.push(row)
	}
	return map
}
//The bellow function was Formed using common development resources.
function countVisibleTrees(grid: number[][]) {
	let count = 0

	// Iterate through each tree in the grid
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			const tree = grid[i][j]

			// Check if tree is visible from the left
			let visibleFromLeft = true
			for (let k = 0; k < j; k++) {
				if (grid[i][k] >= tree) {
					visibleFromLeft = false
					break
				}
			}

			// Check if tree is visible from the right
			let visibleFromRight = true
			for (let k = j + 1; k < grid[i].length; k++) {
				if (grid[i][k] >= tree) {
					visibleFromRight = false
					break
				}
			}

			// Check if tree is visible from the top
			let visibleFromTop = true
			for (let k = 0; k < i; k++) {
				if (grid[k][j] >= tree) {
					visibleFromTop = false
					break
				}
			}

			// Check if tree is visible from the bottom
			let visibleFromBottom = true
			for (let k = i + 1; k < grid.length; k++) {
				if (grid[k][j] >= tree) {
					visibleFromBottom = false
					break
				}
			}

			// If the tree is visible from any direction, increment the count
			if (
				visibleFromLeft ||
				visibleFromRight ||
				visibleFromTop ||
				visibleFromBottom
			) {
				count++
			}
		}
	}

	return count
}
