// middleware.ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/capsules/:path*',
    '/api/recipients/:path*',
    '/api/upload/:path*',
    '/api/stripe/checkout',
    '/api/stripe/portal',
  ],
}
