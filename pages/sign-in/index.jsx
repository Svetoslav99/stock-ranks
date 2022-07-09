import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import SignIn from '../../components/SignIn/SignIn';
import { useEffect } from 'react';

const Index = ({ session }) => {
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/news/top-headlines');
    }
  });

  if (!session) {
    return (
      <>
        <Head>
          <title>Sign in</title>
          <meta name='description' content='Log in page' />
        </Head>
        <SignIn />
      </>
    );
  }
};

export default Index;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session }
  };
}
