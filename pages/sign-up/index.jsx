import Head from 'next/head';

import SignUp from '../../components/SignUp/SignUp';

const Index = () => {
  return (
    <>
      <Head>
        <title>Sign up</title>
        <meta name='description' content='Register page' />
      </Head>
      <SignUp />;
    </>
  );
};

export default Index;
