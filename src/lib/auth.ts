import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Authorize called with:", { email: credentials?.email }) // Debug
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials") // Debug
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        console.log("👤 User found:", user ? { id: user.id, email: user.email, name: user.name } : "null") // Debug

        if (!user) {
          console.log("❌ User not found") // Debug
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        console.log("🔑 Password match:", passwordMatch) // Debug

        if (!passwordMatch) {
          console.log("❌ Password incorrect") // Debug
          return null
        }

        console.log("✅ Login successful for:", user.email) // Debug
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🎫 JWT callback - user:", user, "token:", token) // Debug
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log("📋 Session callback - token:", token, "session:", session) // Debug
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
