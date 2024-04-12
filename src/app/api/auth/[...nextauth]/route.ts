import NextAuth, { AuthOptions, User as AuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user';
import connect from '@/lib/db-connect';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'email' | 'password', string> | undefined) {
        await connect();

        if (!credentials) {
          throw new Error('Invalid credentials');
        }

        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

            if (isPasswordCorrect) {
              return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                passportNumber: user.passportNumber,
                passportSeries: user.passportSeries,
                registrationAddress: user.registrationAddress,
                role: user.role,
              };
            }
          }
          return null;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AuthUser;
      session.user.role = token.role;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
