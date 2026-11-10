```js
for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase()) {
    const node = new Node("letter " + letter, 20)
    const nodeU = new Node(letter.toUpperCase(), 0)
    const nodeL = new Node(letter, 0)
    UpperCase.addChild(nodeU)
    LowerCase.addChild(nodeL)
    Letter.addChild(node)
    node.addChild(nodeU)
    node.addChild(nodeL)
    if ("aeiou".includes(letter)) {
        vowel.addChild(node)
    } else {
        consonant.addChild(node)
    }
    //Add letters to candidates
    candidateSymbols.push(nodeU)
    candidateSymbols.push(nodeL)
}
```