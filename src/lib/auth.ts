import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@smpn29makassar.sch.id" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Menerima kombinasi email/password apa pun asalkan password admin123
        if (credentials?.password === "admin123" || credentials?.password === "password") {
          return {
            id: "1",
            email: "admin@sekolah.com",
            name: "Admin",
            role: "ADMIN",
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session && session.user && token) {
        (session.user as any).id = token.userId;
      }
      return session
    }
  }
}
