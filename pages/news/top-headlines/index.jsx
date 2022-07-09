import Head from 'next/head';

import NewsHeadlinesGrid from '../../../components/News/NewsHeadlinesGrid/NewsHeadlinesGrid';
import hostAddr from '../../../utils/determine-environment';

const Index = ({ topHeadlines }) => {
  return (
    <>
      <Head>
        <title>Top Headlines</title>
        <meta name='description' content='See the most viewed articles at that moment.' />
      </Head>
      <NewsHeadlinesGrid topHeadlines={topHeadlines} />;
    </>
  );
};

export async function getStaticProps() {
  const res = await fetch(`${hostAddr}/api/news-top-headlines`, { method: 'GET' });
  const { data } = await res.json();

  return {
    props: {
      topHeadlines: data
    },
    revalidate: 300 // 60 sec * 5 min
  };
}

Index.auth = {
  role: 'user'
};

export default Index;
