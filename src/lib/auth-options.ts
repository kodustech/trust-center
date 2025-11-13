import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

if (!githubId || !githubSecret) {
  console.warn(
    "GITHUB_ID and GITHUB_SECRET are not configured. Social login will not work until they are set."
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: githubId ?? "missing-id",
      clientSecret: githubSecret ?? "missing-secret",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
