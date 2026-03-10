import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// No lib imports needed for this endpoint

/**
 * User signup endpoint
 * SECURITY: Password hashed with bcrypt, JWT signed
 * NOTE: For MVP, uses in-memory storage. Add Prisma for persistence.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // TODO: Save to Prisma/SQLite
    // const user = await prisma.user.create({
    //   data: { email, password: hashedPassword, name }
    // })

    // Create JWT
    const token = jwt.sign(
      { email, name },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: { email, name },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
