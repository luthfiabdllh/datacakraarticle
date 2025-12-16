import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

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
                            username: data.user.username,
                            email: data.user.email,
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
                token.username = user.username
                token.jwt = user.jwt
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as number
                (session.user as any).username = token.username as string
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
