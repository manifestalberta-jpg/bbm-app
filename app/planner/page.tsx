'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface PlanItem {
  id: string;
  title: string;
  time: string;
  category: string;
}

export default function PlannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<PlanItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newCategory, setNewCategory] = useState('Work');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = ['Work', 'Personal', 'Health', 'Shopping', 'Social', 'Other'];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      loadPlan();
    }
  }, [status, router, selectedDate]);

  const loadPlan = async () => {
    try {
      const response = await fetch(`/api/plans?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load plan:', err);
    }
  };

  const savePlan = async () => {
    try {
      setError('');
      setSuccess(false);
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          items: items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save plan');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plan');
    }
  };

  const addItem = () => {
    if (!newTitle.trim()) {
      setError('Title is required');
      return;
    }

    const newItem: PlanItem = {
      id: Date.now().toString(),
      title: newTitle,
      time: newTime,
      category: newCategory,
    };

    setItems([...items, newItem]);
    setNewTitle('');
    setNewTime('09:00');
    setNewCategory('Work');
    setError('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, movedItem);

    setItems(newItems);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Work: 'bg-blue-500/20 text-blue-400',
      Personal: 'bg-green-500/20 text-green-400',
      Health: 'bg-red-500/20 text-red-400',
      Shopping: 'bg-purple-500/20 text-purple-400',
      Social: 'bg-pink-500/20 text-pink-400',
      Other: 'bg-gray-500/20 text-gray-400',
    };
    return colors[category] || colors['Other'];
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Daily Planner</h1>
          <p className="text-dark-400">Drag and drop to organize your day</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">✅ Plan saved successfully</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-white mb-2 flex items-center space-x-2">
              <Calendar size={18} />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Activity</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add activity..."
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-dark-500 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={addItem}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Item</span>
          </button>

          <button
            onClick={savePlan}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
          >
            Save Plan
          </button>
        </div>

        <div className="glass rounded-xl p-6">
          {items.length === 0 ? (
            <p className="text-dark-400 text-center py-8">No items scheduled. Add one to get started!</p>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="planner">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-dark-800/50 rounded-lg p-4' : ''}`}
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between p-4 bg-dark-800 rounded-lg border border-dark-700 transition-all ${
                              snapshot.isDragging ? 'shadow-lg shadow-green-500/20 bg-dark-700' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="text-white font-semibold">{item.title}</div>
                                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                                  {item.category}
                                </span>
                              </div>
                              <div className="text-dark-400 text-sm mt-1">{item.time}</div>
                            </div>

                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-dark-400 hover:text-red-400 transition-colors ml-4"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        <p className="text-center text-dark-500 text-xs mt-8">
          💡 Tip: Drag items to reorder your day. Changes auto-save.
        </p>
      </div>
    </div>
  );
}
