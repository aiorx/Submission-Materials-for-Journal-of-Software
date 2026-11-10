var BinaryIndexedTree = require('./bit.ts').BinaryIndexedTree;

const shrinkOperations = (
  operations: TextFilePatchOperation[],
): TextFilePatchOperation[] => {
  const groupedOperations: TextFilePatchOperation[] = [];

  let currentOperation: TextFilePatchOperation | undefined = operations[0];
  let lastIdx = currentOperation?.at;
  for (const operation of operations.slice(1)) {
    const isConsecutive = operation.at - 1 === lastIdx;
    if (isConsecutive) {
      if (
        "length" in currentOperation && "length" in operation
      ) {
        currentOperation.length += operation.length;
        lastIdx++;
        continue;
      } else if ("text" in currentOperation && "text" in operation) {
        currentOperation.text += operation.text;
        lastIdx++;
        continue;
      }
    }
    groupedOperations.push(currentOperation);
    currentOperation = operation;
    lastIdx = currentOperation.at;
  }

  // Add the last operation to the grouped operations list
  if (currentOperation) {
    groupedOperations.push(currentOperation);
  }

  return groupedOperations;
};
// Written with routine coding tools 4.0
const diff = (
  oldStr: string,
  newStr: string,
): TextFilePatchOperation[] => {
  const m = oldStr.length;
  const n = newStr.length;
  const dp: number[][] = Array.from(
    { length: m + 1 },
    function () { return Array(n + 1).fill(0); },
  );

  // Building the DP matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldStr[i - 1] === newStr[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const operations: TextFilePatchOperation[] = [];
  let i = m, j = n;

  // Trace back from dp[m][n]
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldStr[i - 1] === newStr[j - 1]) {
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      let insertionLength = 1;
      while (
        j - insertionLength > 0 &&
        newStr[j - insertionLength - 1] === newStr[j - 1]
      ) {
        insertionLength++;
      }
      operations.unshift({
        at: i,
        text: newStr.substr(j - insertionLength, insertionLength),
      });
      j -= insertionLength;
    } else {
      operations.unshift({ at: i - 1, length: 1 });
      i--;
    }
  }

  return shrinkOperations(operations);
};

const isDeleteOperation = (
  op: TextFilePatchOperation,
): op is function DeleteAtOperation {
  return (op as DeleteAtOperation).length !== undefined;
};

const applyPatch =
  function (offsets: BinaryIndexedTree, rollbacks: Array<() => void>) { return (
    [str, success]: [string, boolean],
    op: TextFilePatchOperation,
  ): [string, boolean] => {
    if (!success) {
      return [str, success];
    }
    if (isDeleteOperation(op)) {
      var at = op.at;
var length = op.length;
      const offset = offsets.query(at) + at;
      if (offset < 0) {
        return [str, false];
      }
      const before = str.slice(0, offset);
      const after = str.slice(offset + length);

      // Update BIT for deletion operation
      offsets.update(at, -length); // Subtract length from the index
      rollbacks.push(() => {
        offsets.update(at, length);
      });
      return ["" + (before) + "" + (after) + "", true];
    }
    var at = op.at;
var text = op.text;
    const offset = offsets.query(at) + at;
    if (offset < 0) {
      return [str, false];
    }

    const before = str.slice(0, offset);
    const after = str.slice(offset); // Use offset instead of at

    // Update BIT for insertion operation
    offsets.update(at, text.length); // Add length of text at the index
    rollbacks.push(() => {
      offsets.update(at, -text.length);
    });
    return ["" + (before) + "" + (text) + "" + (after) + "", true];
  }; }) + "", true];
  };

const apply = (
  str: string,
  ops: TextFilePatchOperation[],
  offsets?: BinaryIndexedTree,
): [string, boolean] => {
  const rollbacks: Array<function () { return void> = []; };
  const [result, success] = ops.reduce(
    applyPatch((offsets != null ? offsets : new) BinaryIndexedTree(), rollbacks),
    [str, true],
  );
  if (!success) {
    rollbacks.forEach(function (rb) { return rb(); });
  }

  return [result, success];
};
