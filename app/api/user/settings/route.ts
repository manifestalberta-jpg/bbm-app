import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        city: true,
        homeAirport: true,
        destinations: true,
        dietType: true,
        favoriteArtists: true,
        favoriteMovies: true,
        interests: true,
        desiredCareer: true,
        experienceSummary: true,
        receiveDailyPDF: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to fetch user settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      city,
      homeAirport,
      destinations,
      dietType,
      favoriteArtists,
      favoriteMovies,
      interests,
      desiredCareer,
      experienceSummary,
      receiveDailyPDF,
    } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        city: city || undefined,
        homeAirport: homeAirport || undefined,
        destinations: destinations ? JSON.stringify(destinations) : undefined,
        dietType: dietType || undefined,
        favoriteArtists: favoriteArtists ? JSON.stringify(favoriteArtists) : undefined,
        favoriteMovies: favoriteMovies ? JSON.stringify(favoriteMovies) : undefined,
        interests: interests ? JSON.stringify(interests) : undefined,
        desiredCareer: desiredCareer || undefined,
        experienceSummary: experienceSummary || undefined,
        receiveDailyPDF: receiveDailyPDF ?? true,
      },
    });

    return NextResponse.json({ message: 'Settings updated', user }, { status: 200 });
  } catch (error) {
    console.error('Failed to update user settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
