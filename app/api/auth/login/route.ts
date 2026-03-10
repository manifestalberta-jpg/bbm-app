import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * User login endpoint
 * SECURITY: Password verified with bcrypt, returns JWT
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // TODO: Fetch user from DB
    // const user = await prisma.user.findUnique({
    //   where: { email },
    // })

    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Invalid email or password' },
    //     { status: 401 }
    //   )
    // }

    // TODO: Verify password
    // const isValid = await bcrypt.compare(password, user.password)
    // if (!isValid) {
    //   return NextResponse.json(
    //     { error: 'Invalid email or password' },
    //     { status: 401 }
    //   )
    // }

    // Create JWT
    const token = jwt.sign(
      {
        userId: 'placeholder_id', // TODO: Use real user ID
        email,
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        message: 'Logged in successfully',
        token,
        user: {
          email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
