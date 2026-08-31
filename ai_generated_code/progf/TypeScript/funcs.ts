import { IntcodeComputer } from "../intcode/IntcodeComputer.ts";
import { type ImageData, type Pixel, pixels } from "../util/map.ts";

export const tiles = {
  scaffold: 35,
  space: 46,
} as const;

type Direction = "u" | "d" | "l" | "r";

export function runVacuumRobot(
  initialMemory: number[],
  routines: number[][] = [],
): { imageData: ImageData; dust: number } {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  const asciiCodes = [...routines.flat(), "n".charCodeAt(0), 10];

  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        computerStatus = computer.run();
        break;
      case "input":
        const nextAsciiCode = asciiCodes.shift();

        if (!nextAsciiCode) {
          throw new Error("Unexpected input status");
        }

        computer.enqueueInput(nextAsciiCode);
        computerStatus = computer.run();
    }
  }

  let currentChunk = 0;
  const imageData = computer.outputs.reduce<ImageData>((resultArray, item) => {
    if (item === 10) {
      currentChunk++;
      return resultArray;
    }

    if (!resultArray[currentChunk]) {
      resultArray[currentChunk] = [];
    }

    resultArray[currentChunk].push(item);

    return resultArray;
  }, []);

  return { imageData, dust: computer.outputs[computer.outputs.length - 1] };
}

export function asciiToPixel(tile: number): Pixel {
  switch (tile) {
    case tiles.scaffold:
      return pixels.white;
    case tiles.space:
      return pixels.black;
    default:
      return pixels.red;
  }
}

function findIntersections(imageData: ImageData): [number, number][] {
  const intersections: [number, number][] = [];

  // No intersections on the edges
  for (let y = 1; y < imageData.length - 1; y++) {
    for (let x = 1; x < imageData[y].length - 1; x++) {
      const tilesToCheck = [
        imageData[y][x],
        imageData[y][x - 1],
        imageData[y][x + 1],
        imageData[y - 1][x],
        imageData[y + 1][x],
      ];

      if (tilesToCheck.every((tile) => tile === tiles.scaffold)) {
        intersections.push([x, y]);
      }
    }
  }

  return intersections;
}

function getAlignmentParameter([x, y]: [number, number]): number {
  return x * y;
}

export function getSumOfAlignmentParameters(imageData: ImageData): number {
  const intersections = findIntersections(imageData);

  return intersections.reduce((sum, intersection) => {
    return sum + getAlignmentParameter(intersection);
  }, 0);
}

function getStartAndDirection(imageData: ImageData): {
  x: number;
  y: number;
  direction: Direction;
} {
  for (let y = 0; y < imageData.length; y++) {
    for (let x = 0; x < imageData[y].length; x++) {
      if (
        !([tiles.scaffold, tiles.space] as number[]).includes(imageData[y][x])
      ) {
        switch (String.fromCharCode(imageData[y][x])) {
          case "^":
            return {
              direction: "u",
              x,
              y,
            };
          case "v":
            return {
              direction: "d",
              x,
              y,
            };
          case "<":
            return {
              direction: "l",
              x,
              y,
            };
          case ">":
            return {
              direction: "r",
              x,
              y,
            };
          default:
            throw new Error(`Unknown character code "${imageData[y][x]}"`);
        }
      }
    }
  }

  throw new Error("Could not find start coordinates");
}

function getNextXY(
  x: number,
  y: number,
  direction: Direction,
): [number, number] {
  switch (direction) {
    case "u":
      return [x, y - 1];
    case "d":
      return [x, y + 1];
    case "l":
      return [x - 1, y];
    case "r":
      return [x + 1, y];
    default:
      throw new Error(`Unexpected direction ${direction}`);
  }
}

function turnRight(direction: Direction): Direction {
  switch (direction) {
    case "u":
      return "r";
    case "d":
      return "l";
    case "l":
      return "u";
    case "r":
      return "d";
  }
}

function turnLeft(direction: Direction): Direction {
  switch (direction) {
    case "u":
      return "l";
    case "d":
      return "r";
    case "l":
      return "d";
    case "r":
      return "u";
  }
}

interface InstructionsAndData {
  x: number;
  y: number;
  instructions: ("R" | "L" | "F")[];
  direction: Direction;
}

function getNextInstructionsAndData(
  currentX: number,
  currentY: number,
  directionForward: Direction,
  imageData: ImageData,
  visitedCoordinates: string[],
): InstructionsAndData[] {
  const nextInstructionsAndData: InstructionsAndData[] = [];

  const [nextXForward, nextYForward] = getNextXY(
    currentX,
    currentY,
    directionForward,
  );

  if (
    imageData[nextYForward]?.[nextXForward] &&
    imageData[nextYForward][nextXForward] === tiles.scaffold
  ) {
    nextInstructionsAndData.push({
      x: nextXForward,
      y: nextYForward,
      instructions: ["F"],
      direction: directionForward,
    });
  }

  const directionRight = turnRight(directionForward);
  const [nextXRight, nextYRight] = getNextXY(
    currentX,
    currentY,
    directionRight,
  );

  if (
    imageData[nextYRight]?.[nextXRight] &&
    imageData[nextYRight][nextXRight] === tiles.scaffold
  ) {
    nextInstructionsAndData.push({
      x: nextXRight,
      y: nextYRight,
      instructions: ["R", "F"],
      direction: directionRight,
    });
  }

  const directionLeft = turnLeft(directionForward);
  const [nextXLeft, nextYLeft] = getNextXY(currentX, currentY, directionLeft);

  if (
    imageData[nextYLeft]?.[nextXLeft] &&
    imageData[nextYLeft][nextXLeft] === tiles.scaffold
  ) {
    nextInstructionsAndData.push({
      x: nextXLeft,
      y: nextYLeft,
      instructions: ["L", "F"],
      direction: directionLeft,
    });
  }

  if (nextInstructionsAndData.length > 1) {
    return nextInstructionsAndData.filter(
      (nextInstructionAndData) =>
        !visitedCoordinates.includes(
          `${nextInstructionAndData.x},${nextInstructionAndData.y}`,
        ),
    );
  }

  return nextInstructionsAndData;
}

function rawInstructionToInstruction(rawInstruction: string): string[] {
  const instructionParts: string[] = [];
  const rawInstructionArr = rawInstruction.split("");
  let fCounter = 0;

  for (let i = 0; i < rawInstructionArr.length; i++) {
    if (rawInstructionArr[i] !== "F") {
      if (fCounter > 0) {
        instructionParts.push(fCounter.toString());
        fCounter = 0;
      }

      instructionParts.push(rawInstructionArr[i]);
    } else {
      fCounter++;
    }
  }

  if (fCounter > 0) {
    instructionParts.push(fCounter.toString());
  }

  return instructionParts;
}

export function instructionToAsciiInstruction(instruction: string[]): number[] {
  return instruction
    .map((part) => part.split("").map((s) => s.charCodeAt(0)))
    .flatMap((x) => [44, x])
    .flat()
    .slice(1);
}

export function instructionToAsciiInstructionWithNewline(
  instruction: string[],
): number[] {
  return [...instructionToAsciiInstruction(instruction), 10];
}

type BestFunctionCandidate = {
  matches: number;
  total: number;
  instruction: string[];
  ratio: number;
};

function getBestFunctionCandidates(
  fullInstructionStr: string,
  invalidCharacters: string[],
): BestFunctionCandidate[] {
  const bestFunctionCandidates: BestFunctionCandidate[] = [];
  const checkedSubstrings = new Set<string>();

  for (let start = 0; start < fullInstructionStr.length; start++) {
    let numMatches = 0;
    let end = start + 1;

    do {
      const substring = fullInstructionStr.substring(start, end);

      if (checkedSubstrings.has(substring)) {
        continue;
      }

      checkedSubstrings.add(substring);

      if (
        invalidCharacters.some((invalidCharacter) =>
          substring.includes(invalidCharacter),
        )
      ) {
        numMatches = 0;
      } else {
        const matches = [
          ...fullInstructionStr.matchAll(new RegExp(substring, "g")),
        ];

        numMatches = matches.length;
        end++;

        if (numMatches > 1 && numMatches < 20) {
          const total = numMatches * substring.length;
          const instruction = substring
            .split(/([A-Z])/)
            .filter((s) => s !== "");

          const asciiInstruction = instructionToAsciiInstruction(instruction);
          const ratio = total / numMatches;

          if (asciiInstruction.length <= 20 && ratio > 1) {
            bestFunctionCandidates.push({
              matches: numMatches,
              total,
              instruction,
              ratio,
            });
          }
        }
      }
    } while (numMatches > 1 && end <= fullInstructionStr.length);
  }

  // If we could somehow find actually the best candidates that would be cool
  bestFunctionCandidates.sort((a, b) => b.ratio - a.ratio);
  return bestFunctionCandidates.slice(0, 10);
}

// Thanks ChatGPT
function fullReplacements(
  input: string,
  target: string,
  replacement: string,
): string[] {
  const n = input.length;
  const m = target.length;

  // 1) dp[i] = maximum # of replacements we can still do from position i
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    // option A: skip this char
    const skip = dp[i + 1];
    // option B: replace here (if it matches)
    const take = input.startsWith(target, i) ? 1 + dp[i + m] : 0;
    dp[i] = Math.max(skip, take);
  }

  // 2) backtrack only along paths that reach dp[0] total replacements
  const results = new Set<string>();
  function dfs(current: string, i: number) {
    if (i >= n) {
      results.add(current);
      return;
    }

    // If matching + taking here still can reach the max
    if (input.startsWith(target, i) && 1 + dp[i + m] === dp[i]) {
      dfs(current + replacement, i + m);
    }

    // If skipping this char still can reach the max
    if (dp[i + 1] === dp[i]) {
      dfs(current + input[i], i + 1);
    }
  }

  dfs("", 0);
  return Array.from(results);
}

export function explore(
  imageData: ImageData,
  instructionAndData: InstructionsAndData,
  instructions: string[],
  visitedCoordinates: string[],
): string | string[] {
  const nextInstructionsAndData = getNextInstructionsAndData(
    instructionAndData.x,
    instructionAndData.y,
    instructionAndData.direction,
    imageData,
    visitedCoordinates,
  );

  if (nextInstructionsAndData.length === 0) {
    const routeComplete = imageData.every((row, y) =>
      row.every((tile, x) => {
        if (tile !== tiles.scaffold) {
          return true;
        }

        return [
          ...visitedCoordinates,
          `${instructionAndData.x},${instructionAndData.y}`,
        ].includes(`${x},${y}`);
      }),
    );

    if (!routeComplete) {
      return [];
    }

    return instructions.join("");
  }

  return nextInstructionsAndData.flatMap((nextInstructionAndData) =>
    explore(
      imageData,
      nextInstructionAndData,
      [...instructions, ...nextInstructionAndData.instructions],
      [
        ...visitedCoordinates,
        `${instructionAndData.x},${instructionAndData.y}`,
      ],
    ),
  );
}

export function findValidInstructionAndFunctionsToEnd(imageData: ImageData): {
  instruction: string[];
  a: string[];
  b: string[];
  c: string[];
  instructionWithoutFunctions: string[];
} {
  const {
    x: startX,
    y: startY,
    direction: startDirection,
  } = getStartAndDirection(imageData);

  const instructions = getNextInstructionsAndData(
    startX,
    startY,
    startDirection,
    imageData,
    [`${startX},${startY}`],
  ).flatMap((nextInstructionAndData) =>
    explore(
      imageData,
      nextInstructionAndData,
      nextInstructionAndData.instructions,
      [`${startX},${startY}`],
    ),
  );

  // Seems like the first possible route always works...
  const instruction = rawInstructionToInstruction(instructions[0]);

  const bestASubstrings = getBestFunctionCandidates(instruction.join(""), []);

  for (let bestASubstring of bestASubstrings) {
    const fullInstructionStringsWithA = fullReplacements(
      instruction.join(""),
      bestASubstring.instruction.join(""),
      "A",
    );

    for (let fullInstructionStringWithA of fullInstructionStringsWithA) {
      const bestBSubstrings = getBestFunctionCandidates(
        fullInstructionStringWithA,
        ["A"],
      );

      for (let bestBSubstring of bestBSubstrings) {
        const fullInstructionStringsWithAB = fullReplacements(
          fullInstructionStringWithA,
          bestBSubstring.instruction.join(""),
          "B",
        );

        for (let fullInstructionStringWithAB of fullInstructionStringsWithAB) {
          const bestCSubstrings = getBestFunctionCandidates(
            fullInstructionStringWithAB,
            ["A", "B"],
          );

          for (let bestCSubstring of bestCSubstrings) {
            const fullInstructionStringsWithABC = fullReplacements(
              fullInstructionStringWithAB,
              bestCSubstring.instruction.join(""),
              "C",
            );

            for (let fullInstructionStringWithABC of fullInstructionStringsWithABC) {
              const isValidSolution = !(
                fullInstructionStringWithABC.includes("L") ||
                fullInstructionStringWithABC.includes("R") ||
                fullInstructionStringWithABC.includes("F")
              );

              if (isValidSolution) {
                return {
                  a: bestASubstring.instruction,
                  b: bestBSubstring.instruction,
                  c: bestCSubstring.instruction,
                  instruction: fullInstructionStringWithABC.split(""),
                  instructionWithoutFunctions: instruction,
                };
              }
            }
          }
        }
      }
    }
  }

  throw new Error("Didn't find any solution :(");
}
