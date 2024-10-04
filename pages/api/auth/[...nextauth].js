import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  
    // ...add more providers here
  ],
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     // Allows relative callback URLs
  //     // if (url.startsWith("/")) return `${baseUrl}${url}`
  //     if (url.startsWith("/")) return '/dashboard'
  //     // Allows callback URLs on the same origin
  //     else if (new URL(url).origin === baseUrl) return url
  //     return '/dashboard'
  //   }
  // }
}

export default NextAuth(authOptions)