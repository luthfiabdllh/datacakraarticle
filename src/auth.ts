import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                identifier: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!API_URL) return null;

                try {
                    const res = await fetch(`${API_URL}/api/auth/local`, {
                        method: "POST",
                        body: JSON.stringify({
                            identifier: credentials.identifier,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    })

                    const data = await res.json()

                    if (!res.ok) {
                        throw new Error(data.error?.message || "Authentication failed")
                    }

                    if (data.jwt && data.user) {
                        return {
                            id: data.user.id,
                            documentId: data.user.documentId,
                            username: data.user.username,
                            email: data.user.email,
                            provider: data.user.provider,
                            confirmed: data.user.confirmed,
                            blocked: data.user.blocked,
                            createdAt: data.user.createdAt,
                            updatedAt: data.user.updatedAt,
                            publishedAt: data.user.publishedAt,
                            jwt: data.jwt,
                        }
                    }
                    return null
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id as number
                token.documentId = user.documentId
                token.username = user.username
                token.provider = user.provider
                token.confirmed = user.confirmed
                token.blocked = user.blocked
                token.createdAt = user.createdAt
                token.updatedAt = user.updatedAt
                token.publishedAt = user.publishedAt
                token.jwt = user.jwt
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.id as number
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).documentId = token.documentId as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).username = token.username as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).provider = token.provider as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).confirmed = token.confirmed as boolean
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).blocked = token.blocked as boolean
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).createdAt = token.createdAt as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).updatedAt = token.updatedAt as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).publishedAt = token.publishedAt as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).jwt = token.jwt as string
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
})
