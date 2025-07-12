import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './src/lib/auth'
 
// Limit the middleware to paths starting with `/trak/`
export const config = {
  matcher: '/trak/:path',
}
 
export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  console.log("Called")
  if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return NextResponse.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}