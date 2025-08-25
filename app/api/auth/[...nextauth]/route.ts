import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

// --- PENGATURAN AKUN SUPERADMIN ---
const SUPERADMIN_EMAIL = "superadmin@firedetec.com";
const SUPERADMIN_PASSWORD = "superadmin123";
// ------------------------------------

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // --- LOGIKA HARDCODE SUPERADMIN ---
        // Cek apakah email dan password yang dimasukkan cocok dengan data superadmin
        const isSuperAdmin =
          credentials.email === SUPERADMIN_EMAIL &&
          credentials.password === SUPERADMIN_PASSWORD;

        if (isSuperAdmin) {
          // Jika cocok, kembalikan data user superadmin
          console.log("Superadmin login successful");
          return {
            id: "superadmin-01",
            email: SUPERADMIN_EMAIL,
            name: "Super Admin",
          };
        }

        // Jika bukan superadmin, jangan izinkan login
        console.log("Invalid credentials for superadmin");
        return null;
        
        /*
        // --- LOGIKA DATABASE (Dinonaktifkan untuk sementara) ---
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        };
        */
      },
    }),
  ],
  pages: {
    signIn: '/', // Arahkan ke halaman login utama
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
