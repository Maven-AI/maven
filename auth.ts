// import NextAuth from "next-auth";
// import SlackProvider from "next-auth/providers/slack";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     SlackProvider({
//       clientId: process.env.SLACK_CLIENT_ID!,
//       clientSecret: process.env.SLACK_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope: "channels:read,chat:write,im:history,users:read,team:read,bot",
//           user_scope: "identity.basic",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.botToken = account.bot_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.botToken = token.botToken as string;
//       return session;
//     },
//   },
// });
import NextAuth from "next-auth";
import Slack from "next-auth/providers/slack";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Slack],
});
