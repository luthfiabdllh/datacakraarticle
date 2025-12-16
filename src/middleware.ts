import { auth } from "@/auth"

export default auth((req) => {
    // Middleware logic will be enhanced later to protect /dashboard
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
