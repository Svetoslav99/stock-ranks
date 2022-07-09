import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import hostAddr from '../../../utils/determine-environment';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',

      async authorize(credentials) {
        console.log('credentials: ', credentials);

        try {
          const res = await fetch(`${hostAddr}/api/sign-in`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { 'Content-Type': 'application/json' }
          });

          const { user, error } = await res.json();

          if (error || !user) {
            return null;
          }
          // If no error and we have user data, return it
          if (!error && user) {
            return user;
          }
        } catch (e) {
          console.log('error: ', e);
          return {
            error: true,
            message: e || e.message
          };
        }
      }
    }),
    GoogleProvider({
      id: 'google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/sign-in'
  },
  callbacks: {
    jwt: ({ token, user }) => {
      // console.log('jwt token: ', token);
      // console.log('jwt user: ', user);

      if (user) {
        token.id = user.id;

        // that following 2 checks mean that we are using credentials provider so we are setting up the token as it is working with google provider.
        if (!token.name && user.username) {
          token.name = user.username;
          token.provider = 'credentials';
        }

        if (!token.image && user.avatarLink) {
          token.image = user.avatarLink;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      // console.log('session session:', session);
      // console.log('session token:', token);

      if (token) {
        session.id = token.id;

        // that following 3 if`s mean that we are using credentials provider so we are setting up the token as it is working with google provider.
        if (!session.user.name) {
          session.user.name = token.name;
        }

        if (!session.user.image) {
          session.user.image = token.image;
        }

        if (token.provider) {
          session.provider = token.provider;
        } else if (session.user.name && session.user.email && session.user.image) {
          // on first log in - create user in the db with these credentials since the provider is not credentials provider.
          try {
            const res = await fetch(`${hostAddr}/api/check-user-exists`, {
              method: 'POST',
              body: JSON.stringify({
                email: session.user.email,
                image: session.user.image,
                name: session.user.name
              }),
              headers: { 'Content-Type': 'application/json' }
            });
            // const data = await res.json();
          } catch (e) {
            console.log(e);
          }
        }
      }

      // console.log('session: ', session);
      return session;
    }
  }
});
