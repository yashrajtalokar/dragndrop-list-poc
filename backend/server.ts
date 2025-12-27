import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface Item {
    id: string;
    name: string;
    order: number;
}

// In-memory data store
let items: Item[] = [
    { id: '1', name: 'Design Research', order: 0 },
    { id: '2', name: 'Wireframing', order: 1 },
    { id: '3', name: 'Prototyping', order: 2 },
    { id: '4', name: 'User Testing', order: 3 },
    { id: '5', name: 'Final Handover', order: 4 },
    { id: '6', name: 'Project Kickoff', order: 5 },
    { id: '7', name: 'Stakeholder Interview', order: 6 },
    { id: '8', name: 'Market Analysis', order: 7 },
];

// Helper to sort items
const getSortedItems = () => [...items].sort((a, b) => a.order - b.order);

app.get('/items', (req: Request, res: Response) => {
    res.json(getSortedItems());
});

/**
 * Reorder logic:
 * Adjusts order within the affected range.
 * This is efficient because we only update the range [min(from, to), max(from, to)].
 */
app.post('/items/reorder', (req: Request, res: Response) => {
    const { movedItemId, fromIndex, toIndex } = req.body;

    if (typeof movedItemId !== 'string' || typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const sortedItems = getSortedItems();
    const movedItem = sortedItems.find(item => item.id === movedItemId);

    if (!movedItem) {
        return res.status(404).json({ error: 'Item not found' });
    }

    console.log(`Reordering ${movedItemId} from ${fromIndex} to ${toIndex}`);

    // In a real DB, we would use a transaction to update the orders.
    // Here we update the in-memory array.

    if (fromIndex < toIndex) {
        // Moving down: items between from and to decrease their order by 1
        items.forEach(item => {
            if (item.id === movedItemId) {
                item.order = toIndex;
            } else if (item.order > fromIndex && item.order <= toIndex) {
                item.order -= 1;
            }
        });
    } else if (fromIndex > toIndex) {
        // Moving up: items between to and from increase their order by 1
        items.forEach(item => {
            if (item.id === movedItemId) {
                item.order = toIndex;
            } else if (item.order >= toIndex && item.order < fromIndex) {
                item.order += 1;
            }
        });
    }

    res.status(200).json({ message: 'Success' });
});

const server = app.listen(PORT, () => {
    console.log(`Backend POC server running at http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
