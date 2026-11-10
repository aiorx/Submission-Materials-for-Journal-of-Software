// Accessing the third to last element in a mixed array
const mixed = ['a', 1, true, { name: 'John' }, [5, 6]]
const thirdToLast = mixed[mixed.length - 3]
// VIOLATES: Should use mixed.at(-3) to directly indicate negative indexing

// Written with routine coding tools-4-0125-preview
