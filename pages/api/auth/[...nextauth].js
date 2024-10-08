import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import { FirestoreAdapter } from "@next-auth/firebase-adapter";

import db from '../../../compnents/firebase'
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
 
  
    // ...add more providers here
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      console.log('token',token);
      console.log('user',user);
      console.log('trigger',trigger);
      console.log('session',session);

      if (user) {
        // Add custom fields to the JWT

        if(token.email == 'pnna5555@gmail.com' || token.email == 'pnna5555@gmail.com'){
          token.role = 'admin';
        }else{
          token.role = 'supplier';
          // supplier
        }
        
      }
  


        // we have to make check on user, because The arguments user, account, profile are only passed
        // the first time this callback is called on a new session, after the user signs in. In subsequent calls,
        // only token will be available.

        // here r is some random value that we want to be present in token
        if (user && user.r) {
            token.r = user.r;
        }

        if (trigger === "update") {
            token.email = session.email;
            token.name = session.name;
            token.role = session.role;
            

          // if(session.role){
          //   token.role = session.role;
          // }

        }

        return token;
    },
    async session({ session, token, user }) {
          // Add custom properties to the session object
          session.user.id = 'ss';
          if(session.user.email == 'pnna5555@gmail.com' || session.user.email == 'pnna5555@gmail.com'){
            session.user.role = 'admin';
          }else{
            session.user.role= 'supplier';
            // supplier
          }
          session.user.role = token.role;
          session.accessToken = session.user.email;
          return session;
        }
  }
    
  // callbacks: {
  //   async session({ session, token, user }) {
  //     // Add custom properties to the session object
  //     session.user.id = 'ss';
  //     session.user.role = 'unknown';
  //     session.accessToken = 'token';
  //     return session;
  //   }
  // }

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