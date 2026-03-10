import { NextResponse } from 'next/server';

const recipeDatabase: Record<string, any> = {
  KETO: {
    title: 'Avocado Egg Boats',
    ingredients: ['2 avocados', '2 eggs', 'salt', 'pepper', 'bacon bits'],
    instructions: ['Halve avocados', 'Create small well in center', 'Crack egg into well', 'Bake at 425°F for 15 min'],
    calorieCount: 320,
    imageUrl: 'https://picsum.photos/400/300?random=keto1',
  },
  MEDITERRANEAN: {
    title: 'Greek Salad with Feta',
    ingredients: ['2 cups tomatoes', '1 cucumber', '½ cup feta', 'olives', 'olive oil', 'lemon juice'],
    instructions: ['Chop vegetables', 'Mix with olives', 'Top with feta', 'Drizzle with olive oil and lemon'],
    calorieCount: 280,
    imageUrl: 'https://picsum.photos/400/300?random=med1',
  },
  VEGAN: {
    title: 'Buddha Bowl with Chickpeas',
    ingredients: ['1 cup cooked chickpeas', 'sweet potato', 'spinach', 'tahini dressing', 'nuts'],
    instructions: ['Roast sweet potato', 'Cook spinach', 'Mix chickpeas', 'Assemble and drizzle with tahini'],
    calorieCount: 380,
    imageUrl: 'https://picsum.photos/400/300?random=vegan1',
  },
};

export async function POST(req: Request) {
  try {
    const { dietType } = await req.json();
    const recipe = recipeDatabase[dietType] || recipeDatabase.MEDITERRANEAN;
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(recipeDatabase);
}
