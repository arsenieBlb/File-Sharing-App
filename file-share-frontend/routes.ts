/** Routes accessible to everyone, no login required. */
export const publicRoutes = ["/", "/share"];

/** Auth routes — redirect logged-in users away to the dashboard. */
export const authRoutes = ["/login", "/register"];

/** Prefix for Next-Auth internal API routes. */
export const apiAuthPrefix = "/api/auth";

/** Where to send the user after a successful login. */
export const DEFAULT_LOGIN_REDIRECT = "/upload";