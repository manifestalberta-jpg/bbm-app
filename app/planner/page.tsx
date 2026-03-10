'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';

interface PlanItem {
  id: string;
  time: string;
  task: string;
  completed: boolean;
}

export default function PlannerPage() {
  const [items, setItems] = useState<PlanItem[]>([
    { id: '1', time: '08:00', task: 'Morning workout', completed: false },
    { id: '2', time: '09:30', task: 'Breakfast', completed: false },
    { id: '3', time: '14:00', task: 'Lunch', completed: false },
    { id: '4', time: '18:00', task: 'Dinner', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const addItem = () => {
    if (newTask && newTime) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          time: newTime,
          task: newTask,
          completed: false,
        },
      ]);
      setNewTask('');
      setNewTime('');
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleComplete = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIdx = items.findIndex((i) => i.id === draggedId);
    const targetIdx = items.findIndex((i) => i.id === targetId);

    const newItems = [...items];
    [newItems[draggedIdx], newItems[targetIdx]] = [newItems[targetIdx], newItems[draggedIdx]];
    setItems(newItems);
    setDraggedId(null);
  };

  const sortedItems = items.sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Daily Planner</h1>

        {/* Add new item */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Add New Task</h2>
          <div className="flex gap-4">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:border-green-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Task description..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:border-green-500 transition-colors"
            />
            <button
              onClick={addItem}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Tasks timeline */}
        <div className="space-y-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(item.id)}
              className={`glass rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all cursor-move ${
                draggedId === item.id ? 'opacity-50 scale-95' : ''
              }`}
            >
              <GripVertical size={20} className="text-dark-500 flex-shrink-0" />
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
                className="w-5 h-5 rounded accent-green-500 cursor-pointer"
              />
              <div className="text-center min-w-fit">
                <span className="text-lg font-bold text-green-400">{item.time}</span>
              </div>
              <p
                className={`flex-1 ${
                  item.completed
                    ? 'line-through text-dark-500'
                    : 'text-dark-200'
                }`}
              >
                {item.task}
              </p>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-dark-500 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
