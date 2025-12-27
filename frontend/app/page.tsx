'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/SortableItem';

interface Item {
  id: string;
  name: string;
  order: number;
}

const API_URL = 'http://localhost:3001/items';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [initialOrder, setInitialOrder] = useState<Item[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load initial data
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setInitialOrder(data);
      })
      .catch(() => setError('Failed to load items. Is the backend running?'));
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    // Optimistic UI update
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, order: idx }));
    setItems(reordered);
    setIsSyncing(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movedItemId: active.id, fromIndex: oldIndex, toIndex: newIndex }),
      });
      if (!res.ok) throw new Error('Sync failed');
      // keep UI state; just clear syncing after a short delay
      setTimeout(() => setIsSyncing(false), 500);
    } catch (e) {
      console.error(e);
      setError('Sync failed. Rolling back...');
      // rollback to the original order
      setItems(initialOrder);
      setTimeout(() => {
        setError(null);
        setIsSyncing(false);
      }, 2000);
    }
  }, [items, initialOrder]);

  return (
    <main>
      <h1 className="title">Draggable POC</h1>
      <p className="subtitle">Smooth reordering with optimistic updates & lightweight persistence</p>
      <div className="container">
        <div className="table-header">
          <div></div>
          <div>Item Name</div>
          <div style={{ textAlign: 'right' }}>Order</div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} {...item} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className={`status-indicator ${isSyncing || error ? 'visible' : ''}`}>
        <div className={`dot ${isSyncing ? 'syncing' : ''}`} style={error ? { background: '#ef4444' } : {}}></div>
        <span>{error || 'Syncing with backend...'}</span>
      </div>
    </main>
  );
}
