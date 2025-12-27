// Basic test for the reorder logic
// In a real project, we'd use Jest or Vitest

interface Item {
    id: string;
    name: string;
    order: number;
}

function reorder(items: Item[], movedItemId: string, fromIndex: number, toIndex: number): Item[] {
    return items.map(item => {
        const newItem = { ...item };
        if (newItem.id === movedItemId) {
            newItem.order = toIndex;
        } else if (fromIndex < toIndex) {
            if (newItem.order > fromIndex && newItem.order <= toIndex) {
                newItem.order -= 1;
            }
        } else if (fromIndex > toIndex) {
            if (newItem.order >= toIndex && newItem.order < fromIndex) {
                newItem.order += 1;
            }
        }
        return newItem;
    }).sort((a, b) => a.order - b.order);
}

// Test Case 1: Move item identifier '1' from index 0 to index 2
const initialItems: Item[] = [
    { id: '1', name: 'A', order: 0 },
    { id: '2', name: 'B', order: 1 },
    { id: '3', name: 'C', order: 2 },
];

const result1 = reorder(initialItems, '1', 0, 2);
console.log('Test 1 (0 -> 2):', JSON.stringify(result1.map(i => i.id)) === '["2","3","1"]' ? 'PASS' : 'FAIL');
console.log('Result Orders:', result1.map(i => i.order));

// Test Case 2: Move item identifier '3' from index 2 to index 0
const result2 = reorder(initialItems, '3', 2, 0);
console.log('Test 2 (2 -> 0):', JSON.stringify(result2.map(i => i.id)) === '["3","1","2"]' ? 'PASS' : 'FAIL');
console.log('Result Orders:', result2.map(i => i.order));
