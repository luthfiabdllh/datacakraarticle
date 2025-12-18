import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: number
            documentId: string
            username: string
            email: string
            provider: string
            confirmed: boolean
            blocked: boolean
            createdAt: string
            updatedAt: string
            publishedAt: string
            jwt: string
        } & DefaultSession["user"]
    }

    interface User {
        id: number
        documentId: string
        username: string
        email: string
        provider: string
        confirmed: boolean
        blocked: boolean
        createdAt: string
        updatedAt: string
        publishedAt: string
        jwt: string
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: number
        documentId: string
        username: string
        provider: string
        confirmed: boolean
        blocked: boolean
        createdAt: string
        updatedAt: string
        publishedAt: string
        jwt: string
    }
}
