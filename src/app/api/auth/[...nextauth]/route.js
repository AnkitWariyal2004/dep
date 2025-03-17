import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/lib/models/user";
import dbConnect from "@/lib/dbConnect";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobileNumber: { label: "Mobile Number", type: "text", required: true, name: "mobileNumber" },
        password: { label: "Password", type: "password", required: true, name: "password" },
      },

      async authorize(credentials) {
        console.log("Connecting to DB...");
        await dbConnect();

        const user = await User.findOne({ mobileNumber: credentials.mobileNumber });

        if (!user) {
          // console.log("❌ User not found!");
          throw new Error("User not found");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          // console.log("❌ Invalid password!");
          throw new Error("Invalid credentials");
        }

        // console.log("✅ User found:", user);

        return {
          id: user._id.toString(),
          name: user.name,
          mobileNumber: user.mobileNumber,
          role: user.role, // Ensure role is included // Handle undefined case
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.mobileNumber = user.mobileNumber;
         // ✅ Fixed typo (was "token.role")
      }
      // console.log("🔹 JWT Token:", token); // Debugging
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          role: token.role,
          mobileNumber: token.mobileNumber,
        };
      }
      // console.log("🔹 Session Data:", session); // Debugging
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
