'use client';

import { useState, useEffect } from 'react';
import { ChefHat, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  calorieCount?: number;
  imageUrl: string;
}

const DIET_TYPES = [
  { id: 'MEDITERRANEAN', label: '🥗 Mediterranean', color: 'from-green-400 to-emerald-500' },
  { id: 'KETO', label: '🥑 Keto', color: 'from-orange-400 to-red-500' },
  { id: 'VEGAN', label: '🌱 Vegan', color: 'from-lime-400 to-green-500' },
  { id: 'VEGETARIAN', label: '🥦 Vegetarian', color: 'from-cyan-400 to-blue-500' },
  { id: 'PALEO', label: '🍖 Paleo', color: 'from-amber-400 to-yellow-500' },
  { id: 'NO_SUGAR', label: '🚫 No Sugar', color: 'from-pink-400 to-rose-500' },
];

export default function DietPage() {
  const [selectedDiet, setSelectedDiet] = useState('MEDITERRANEAN');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchRecipe(selectedDiet);
  }, [selectedDiet]);

  const fetchRecipe = async (dietType: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dietType }),
      });
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
    }
    setLoading(false);
  };

  const saveDiet = () => {
    localStorage.setItem('userDietType', selectedDiet);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 text-dark-400 hover:text-green-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gradient">Diet & Recipes</h1>

        {/* Diet Type Selector */}
        <div className="glass rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Choose Your Diet Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {DIET_TYPES.map((diet) => (
              <button
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`p-4 rounded-lg transition-all ${
                  selectedDiet === diet.id
                    ? `bg-gradient-to-r ${diet.color} text-white font-bold shadow-lg`
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>

          <button
            onClick={saveDiet}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Save Diet Preference
          </button>
          {saved && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4 text-green-400 mt-4">
              ✓ Diet preference saved!
            </div>
          )}
        </div>

        {/* Recipe Display */}
        {loading ? (
          <div className="text-dark-400 text-center py-12">Loading recipe...</div>
        ) : recipe ? (
          <div className="glass rounded-xl overflow-hidden">
            {/* Recipe Header Image */}
            <div className="relative h-80 bg-dark-800 overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Recipe Content */}
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <ChefHat size={28} className="text-green-400" />
                <h3 className="text-3xl font-bold text-white">{recipe.title}</h3>
              </div>

              {recipe.calorieCount && (
                <div className="inline-block bg-green-600 bg-opacity-20 text-green-400 px-4 py-2 rounded-lg mb-6">
                  {recipe.calorieCount} calories per serving
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Ingredients</h4>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-3 text-dark-300">
                      <span className="text-green-400 font-bold">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Instructions</h4>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-4 text-dark-300">
                      <span className="text-green-400 font-bold flex-shrink-0">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-8 border-t border-dark-700">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                  Add to Meal Plan
                </button>
                <button className="flex-1 bg-dark-800 hover:bg-dark-700 text-dark-300 font-bold py-3 rounded-lg transition-colors">
                  Find Ingredients Nearby
                </button>
              </div>

              {/* Integration Hint */}
              <div className="mt-6 p-4 bg-dark-800 rounded-lg text-dark-400 text-sm">
                <p>💡 <strong>Pro tip:</strong> This recipe integrates with your daily planner. Add it to today's schedule!</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
