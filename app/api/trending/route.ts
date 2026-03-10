import { NextResponse } from 'next/server';

const mockTrending = [
  'Budget Travel Hacks 2026',
  'Keto Meal Prep Under $5',
  'Best Free Date Ideas in California',
  'Entry-Level Remote Jobs',
  'Time Management for Entrepreneurs',
  'Sustainable Fashion Deals',
  'Mediterranean Cooking Tips',
  'Music Festival Announcements',
];

export async function GET() {
  return NextResponse.json(mockTrending);
}
