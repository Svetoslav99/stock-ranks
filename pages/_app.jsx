import { SessionProvider, getSession } from 'next-auth/react';

import Auth from '../components/Auth/Auth';
import AppLayout from '../components/AppLayout/AppLayout';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return Component.auth ? (
    <SessionProvider session={pageProps.session}>
      <Auth role={Component.auth.role}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </Auth>
    </SessionProvider>
  ) : (
    <Component {...pageProps} />
  );
}
export default MyApp;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session }
  };
}
