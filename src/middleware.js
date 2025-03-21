import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is not authenticated, redirect to your custom login page
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow only authenticated users
    },
  }
);

// Define protected routes
export const config = {
  matcher: ["/dashboard", "/pricesetting", "/pan",'/settings','/transaction','/user','/promotionalbanner','/addcustomer','/adddocument','/adddistributer','/addwallet','/bannersetting','/changepass','/customerlist','/distributerlist','/documentlist','/edit','/insurance','/pricesetting'], // Add protected routes here
};
