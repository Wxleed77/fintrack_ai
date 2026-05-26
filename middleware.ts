export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*", "/budgets/:path*", "/goals/:path*", "/analytics/:path*", "/subscriptions/:path*", "/settings/:path*"],
};
