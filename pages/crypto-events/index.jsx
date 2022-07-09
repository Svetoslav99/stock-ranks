import Head from 'next/head';
import CryptoEvents from '../../components/CryptoEvents/CryptoEvents';

import hostAddr from '../../utils/determine-environment';

const Index = ({ cryptoEvents }) => {
  return (
    <>
      <Head>
        <title>Crypto Events</title>
        <meta name='description' content='See All upcoming events of the top 100 crypto coins.' />
      </Head>
      <CryptoEvents cryptoEvents={cryptoEvents} />
    </>
  );
};

export async function getStaticProps() {
  const res = await fetch(`${hostAddr}/api/crypto-events`, { method: 'GET' });
  const data = await res.json();

  return {
    props: {
      cryptoEvents: data.data
    },
    revalidate: 43200 // 60 sec * 60 min * 12 hours
  };
}

Index.auth = {
  role: 'user'
};

export default Index;
