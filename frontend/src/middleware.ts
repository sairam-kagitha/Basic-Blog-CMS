import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getUser } from "./actions/authActions"
import { authRoutes, privateRoutesPrefix } from "./routes"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const user = await getUser()

    const isAuthRoute = authRoutes.includes(pathname)
    const isPrivateRoute = pathname.startsWith(privateRoutesPrefix)

    if (user) {
        if (isAuthRoute) {
            return NextResponse.redirect(new URL("/", request.url))
        }

        if (isPrivateRoute && user.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url))
        }
    } else {
        if (isPrivateRoute) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return null
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
