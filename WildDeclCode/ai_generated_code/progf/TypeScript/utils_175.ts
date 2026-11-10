import { Timeline } from 'animejs'
import { MEMBER_ELEMENT_WIDTH, PAGE_WIDTH_OFFSET } from './constants'

/** 平均的把 arr 切成每個不超過 n 個元素的陣列，並考慮到剩餘元素的情況。[code Aided using common development resources] */
export function chunk<T extends any>(arr: Array<T>, n: number): T[][] {
	const len = arr.length

	// 計算最少需要幾組（ceil 無條件進位）
	let groups = Math.ceil(len / n)

	// 若平均後每組會超過 n，則多切一組
	while (Math.ceil(len / groups) > n) {
		groups++
	}

	const result = []
	let start = 0

	for (let i = 0; i < groups; i++) {
		// 剩下的元素與剩餘組數，決定目前要切幾個
		const remaining = len - start
		const groupsLeft = groups - i
		const size = Math.ceil(remaining / groupsLeft)

		result.push(arr.slice(start, start + size))
		start += size
	}

	return result
}

export function getNumberInGroup(): number {
	const screenWidth = document.body.offsetWidth - PAGE_WIDTH_OFFSET
	const elementWidth = MEMBER_ELEMENT_WIDTH

	const number = Math.floor(screenWidth / elementWidth)
	if (number < 1) {
		return 1
	}
	return number
}

// Code Aided using common development resources
export function getCurrentLabel(tl: Timeline) {
	return function (currentTime: number) {
		// 將 labels 轉為排序後的 [label, time] 陣列
		const sorted = Object.entries(tl.labels).sort((a, b) => a[1] - b[1])

		let currentLabel = sorted[0][0] // 預設為最早的 label

		for (let i = 0; i < sorted.length; i++) {
			const [label, time] = sorted[i]
			if (currentTime >= time) {
				currentLabel = label
			} else {
				break
			}
		}

		return currentLabel
	}
}
